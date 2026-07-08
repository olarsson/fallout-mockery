import {
  ENEMY_ATTACK_HIT_FRAME,
  PLAYER_ATTACK_HIT_FRAME,
  TIMING,
} from '@/core/constants';
import type { Cord, EnemyEntity, GameContext } from '@/core/types';
import { setEnemyFacing } from '@/entities/createEnemy';
import { setPlayerFacing } from '@/entities/createPlayer';
import { calculatePathDirection, getHexDistance, getStraightPathBetweenCords, toFacing } from '@/grid/Pathfinding';
import { findEnemyAt } from '@/grid/TileQuery';
import { randomInt } from '@/utils/random';
import { moveEnemyAlongPath } from '@/systems/MovementSystem';

export class CombatSystem {
  constructor(private readonly ctx: GameContext) {}

  /** Engage enemies within aggro range and start combat when any are nearby. */
  checkProximityCombat(): void {
    const { state } = this.ctx;
    const playerCord = state.positions.playerPos.HEX.CORD;
    let anyInRange = false;

    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;

      const distance = getHexDistance(state, playerCord, enemy.HEX.CORD);

      if (distance <= enemy.aggroRange) {
        enemy.engaged = true;
        anyInRange = true;

        setEnemyFacing(
          enemy,
          toFacing(calculatePathDirection(enemy.HEX.CORD, playerCord)),
        );

        if (state.combat.inCombat) {
          this.addToQueue(enemy);
        }
      }
    }

    if (anyInRange && !state.combat.inCombat) {
      this.enterCombat();
    }
  }

  endPlayerTurn(): void {
    const { state } = this.ctx;
    if (state.gameOver || !state.combat.inCombat || state.player.stopActions) return;

    const current = state.combat.queue[state.combat.queuePos];
    if (!current || !('id' in current) || current.id !== '_player') return;

    this.moveToNextInQueue();
  }

  tryCombat(from: Cord, to: Cord): void {
    const { state } = this.ctx;
    const enemy = findEnemyAt(state, to);
    if (!enemy) return;

    const pathToEnemy = getStraightPathBetweenCords(state, from, to);
    const weaponRange = state.player.weapon.range ?? 0;

    if (pathToEnemy.pathLength <= weaponRange) {
      enemy.engaged = true;
      this.addToQueue(enemy);

      if (!state.combat.inCombat) {
        this.enterCombat();
      }

      this.attackEnemy(enemy);
      return;
    }

    const distanceToEnemy = getHexDistance(state, from, to);
    if (distanceToEnemy <= enemy.aggroRange) {
      enemy.engaged = true;
      if (!state.combat.inCombat) {
        this.enterCombat();
      } else {
        this.addToQueue(enemy);
      }
    }

    const pathDirection = calculatePathDirection(enemy.HEX.CORD, state.positions.playerPos.HEX.CORD);
    setEnemyFacing(enemy, toFacing(pathDirection));
  }

  attackEnemy(enemy: EnemyEntity): void {
    const { state, scheduler } = this.ctx;

    setPlayerFacing(
      state.positions.playerPos,
      toFacing(
        calculatePathDirection(
          state.positions.playerPos.HEX.CORD,
          enemy.HEX.CORD,
        ),
      ),
    );

    if (state.player.actionPoints < state.player.weapon.actionPoints) return;

    this.subtractActionPoints(state.player, state.player.weapon.actionPoints);
    state.player.stopActions = true;

    const damage = randomInt(
      state.player.weapon.damage[0],
      state.player.weapon.damage[1],
    );

    const endOfAttack = () => {
      state.player.animation.attackAnimation.stop();
      enemy.health -= damage;

      if (enemy.health <= 0) {
        enemy.alive = false;
        enemy.engaged = false;
        enemy.animation.deathAnimation?.start();
        scheduler.delay(TIMING.animationHoldMs, () => {
          enemy.animation.deathAnimation?.stop();
        });
      }

      state.player.stopActions = false;

      if (this.tryLeaveCombatIfAllEnemiesDead()) return;

      if (state.player.actionPoints === 0) {
        this.moveToNextInQueue();
      }
    };

    state.player.animation.attackAnimation.start();

    scheduler.scheduleRepeating(
      TIMING.attackTickMs,
      PLAYER_ATTACK_HIT_FRAME + 1,
      (tick) => {
        if (tick === PLAYER_ATTACK_HIT_FRAME) {
          enemy.animation.hitAnimation?.start();
          scheduler.delay(TIMING.animationHoldMs, () => {
            enemy.animation.hitAnimation?.stop();
            endOfAttack();
          });
        }
      },
    );
  }

  attackPlayer(enemy: EnemyEntity): void {
    const { state, scheduler } = this.ctx;

    setEnemyFacing(
      enemy,
      toFacing(calculatePathDirection(enemy.HEX.CORD, state.positions.playerPos.HEX.CORD)),
    );

    if (enemy.actionPoints < enemy.weapon.actionPoints) {
      this.nextEnemyAction(enemy);
      return;
    }

    this.subtractActionPoints(enemy, enemy.weapon.actionPoints);

    const damage = randomInt(enemy.weapon.damage[0], enemy.weapon.damage[1]);

    const endOfAttack = () => {
      enemy.animation.attackAnimation.stop();
      state.player.health -= damage;
      state.player.health = Math.max(0, state.player.health);

      if (state.player.health <= 0) {
        this.handlePlayerDeath();
        return;
      }

      this.nextEnemyAction(enemy);
    };

    enemy.animation.attackAnimation.start();

    scheduler.scheduleRepeating(
      TIMING.attackTickMs,
      ENEMY_ATTACK_HIT_FRAME,
      () => undefined,
      endOfAttack,
    );
  }

  nextEnemyAction(enemy: EnemyEntity): void {
    const { state } = this.ctx;
    state.player.stopActions = true;

    if (enemy.actionPoints === 0) {
      this.moveToNextInQueue();
      return;
    }

    const pathToPlayer = getStraightPathBetweenCords(
      state,
      enemy.HEX.CORD,
      state.positions.playerPos.HEX.CORD,
    );

    const weaponRange = enemy.weapon.range ?? 0;

    if (weaponRange >= pathToPlayer.pathLength) {
      if (enemy.actionPoints >= enemy.weapon.actionPoints) {
        this.attackPlayer(enemy);
      } else if (pathToPlayer.pathLength > 1 && enemy.actionPoints >= enemy.moveCost) {
        moveEnemyAlongPath(this.ctx, enemy, enemy.HEX.CORD, state.positions.playerPos.HEX.CORD);
      } else {
        this.moveToNextInQueue();
      }
      return;
    }

    if (enemy.actionPoints >= enemy.moveCost) {
      moveEnemyAlongPath(this.ctx, enemy, enemy.HEX.CORD, state.positions.playerPos.HEX.CORD);
    } else {
      this.moveToNextInQueue();
    }
  }

  moveToNextInQueue(): void {
    const { state } = this.ctx;

    if (this.tryLeaveCombatIfAllEnemiesDead()) return;

    this.setNextInQueue();

    if (state.combat.queuePos === -1) {
      this.leaveCombat();
      return;
    }

    const attackingEntity = state.combat.queue[state.combat.queuePos];
    if (!attackingEntity) {
      this.leaveCombat();
      return;
    }

    if (attackingEntity.id === '_player') {
      state.player.stopActions = false;
      this.resetActionPoints(state.player);
      return;
    }

    if ('engaged' in attackingEntity) {
      this.resetActionPoints(attackingEntity);
      this.nextEnemyAction(attackingEntity);
    }
  }

  private enterCombat(): void {
    const { state } = this.ctx;
    state.combat.inCombat = true;
    this.resetActionPoints(this.ctx.state.player);
    this.clearQueue();
    this.populateQueue();
  }

  private handlePlayerDeath(): void {
    const { state } = this.ctx;
    state.player.health = 0;
    state.player.stopActions = true;
    state.gameOver = true;

    if (state.combat.inCombat) {
      this.leaveCombat();
    }
  }

  private leaveCombat(): void {
    const { state } = this.ctx;
    state.player.stopActions = false;
    state.combat.inCombat = false;
    this.resetActionPoints(state.player);
    this.clearQueue();
  }

  private tryLeaveCombatIfAllEnemiesDead(): boolean {
    const { state } = this.ctx;
    if (state.enemies.some((enemy) => enemy.alive)) return false;
    if (!state.combat.inCombat) return false;

    this.leaveCombat();
    return true;
  }

  private clearQueue(): void {
    this.ctx.state.combat.queuePos = 0;
    this.ctx.state.combat.queue = [];
  }

  private populateQueue(): void {
    const { state } = this.ctx;
    state.combat.queue.push({ id: '_player' });
    for (const enemy of state.enemies) {
      if (enemy.engaged) {
        state.combat.queue.push(enemy);
      }
    }
  }

  private addToQueue(enemy: EnemyEntity): void {
    const exists = this.ctx.state.combat.queue.some(
      (entry) => 'id' in entry && entry.id === enemy.id,
    );
    if (!exists) {
      this.ctx.state.combat.queue.push(enemy);
    }
  }

  private setNextInQueue(): void {
    const { state } = this.ctx;
    let nextPos = state.combat.queuePos + 1;
    if (nextPos > state.combat.queue.length - 1) nextPos = 0;

    let resultPos = -1;
    let i = nextPos;

    while (true) {
      const entry = state.combat.queue[i];
      if (entry) {
        if ('engaged' in entry) {
          if (entry.engaged && entry.alive) resultPos = i;
        } else {
          resultPos = i;
        }
      }

      i += 1;
      if (i > state.combat.queue.length - 1) i = 0;
      if (i === state.combat.queuePos) break;
    }

    state.combat.queuePos = resultPos;
  }

  private subtractActionPoints(
    entity: { actionPoints: number },
    points: number,
  ): void {
    entity.actionPoints -= points;
    if (entity.actionPoints < 0) entity.actionPoints = 0;
  }

  private resetActionPoints(
    entity: { actionPoints: number; DEFAULTS: { actionPoints: number } },
  ): void {
    entity.actionPoints = entity.DEFAULTS.actionPoints;
  }
}

