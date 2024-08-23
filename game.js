import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {displayLobby} from "./server.js";
import {handleUserInput} from "./server.js";

function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
  }


// 플레이어 초기값
export class Player {
  constructor() { 
    this.hp = 220;
    this.power = 15;
    this.powerMore = 20;
    this.skillChance = 35;
    this.specialMovePoint = 3; // Test를 위해서 3으로 시작, 원래 0 시작입니다 !
  }
  // 플레이어의 공격
    playerAttack (player, monster, logs) {
    let moveDis = Math.floor(this.power* ((Math.random()*this.powerMore/100)+1).toFixed(1));
    // 데미지 계산 , 출력
    monster.hp = monster.hp - moveDis
    logs.push(chalk.green(`▲  ${moveDis}만큼 등반했다 !`));
  }

  // 축지법 스킬
  playerSkill(player, monster, logs) {
   if(Math.random()*100 <= this.skillChance) {
      logs.push(chalk.cyan(`●  축지법 성공 !`));
      this.playerAttack(player, monster, logs);
    } else {
      logs.push(chalk.green(`▼ 축지법 실패다아아아앗!! 체력만 낭비되었다.`));
      monster.monsterAttack(player, monster, logs);
    }
  }
 
  // 필살기 !!
 async playerSpecialMove (player, monster, logs) {
    if(this.specialMovePoint === 3) {
      console.log(chalk.redBright(`필살 !!`)+chalk.yellow(`  암벽등반 ! ! ! ! `));
      let specialMoveCount = Math.floor((Math.random()*5)+5);
      let total = 0;
      for(let i = 0; i < specialMoveCount ; i++) {
        let moveDis = Math.floor(this.power* ((Math.random()*this.powerMore/100)+1).toFixed(1));
        monster.hp = monster.hp - moveDis
        console.log(chalk.redBright(`[${i+1}]회 ! `)+chalk.yellow(`${moveDis}M 등반!!`));
        total += moveDis
        await delay(0.12)
      }
      await delay(1)
    this.specialMovePoint = 0;
    logs.push(chalk.redBright(`★ 총 ${specialMoveCount} 회`)+chalk.yellow(` 연 속 등 반 ! ★ `));
    logs.push(chalk.cyanBright(`▲  총 [${total}M] 의 거리를 등반했다. `));
  }
   else {
    logs.push(chalk.green(`※ 필살 충전이 부족합니다. ☞ 현재 충전 : [${player.specialMovePoint}]`));
  }
}

 // 지름길  일격기
  async playerSkill2 (player,monster, logs, stage){
    if( stage % 5 === 0 && stage !== 0) {
      logs.push(chalk.green(` 여기는 지름길을 찾을 수 없어 !`)+chalk.red(`  [BOSS전 사용 불가]`));
      }else {
      let playerSkill2Random = Math.floor(Math.random()*100+1)
      if ( playerSkill2Random >= 90) {
       await TestText("It's a one-hit KO!", 0.08, chalk.red)
      monster.hp = 0;
      console.log(chalk.yellowBright(`\n 지름길을 발견했다 !!`));
      readlineSync.keyIn('\n 스페이스바를 눌러주세요 !');
      logs.push(chalk.bgRedBright.bold(`일격필살 !`));
      } else {
      logs.push(chalk.redBright(`지름길 개척 !`)+chalk.green(` 하지만, 실패했다 !!`));
      monster.monsterAttack(player,monster, logs);
    }
      }
  }
}


// 몬스터 초기값
export class Monster {
  constructor(name, hp, attack) {
    this.name = name
    this.hp = hp
    this.attack = attack
  }
 
  // 몬스터 일반 공격 
  monsterAttack(player, monster, logs) {
    let monsterAttackRange = Math.floor(monster.attack* ((Math.random()*40/100)+1).toFixed(1));  //이거.. 맞겠지..?
    player.hp = player.hp - monsterAttackRange
    logs.push(chalk.green(`☞  체력 ${monsterAttackRange} 소모`));
  }

}

// 상태창 함수
async function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n======================== 상태 정보창 ========================`));
  console.log(
    chalk.cyanBright(` | 현재 높이 | : ${stage*100} M 구간\n `) +
    chalk.blueBright( `| 플레이어 정보 | 체력: ${player.hp} 등산력: ${player.power} ~ ${Math.floor(player.power*(1+player.powerMore/100))} 최대배율 ${player.powerMore}\n`) +
    chalk.redBright( ` | ${monster.name} | 남은 거리: ${monster.hp} M  체력 소모량 : ${monster.attack}~${Math.floor(monster.attack*((40/100)+1).toFixed(1))}`,),
  );
  console.log(chalk.magentaBright(`=============================================================\n`));
}


// 배틀
const battle = async (stage, player, monster) => {
  let logs = [];


  // 마지막 턴의 계산까지 디스플레이를 하기 위한 방법?
  while(true) { //혼날것 같은 while true 두두둥..
    console.clear();
    displayStatus(stage, player, monster);

  //로그가 너무 많으면 정리한 후 출력
   while(logs.length >14) {logs.shift();}
   logs.forEach((log) => console.log(log));

   // 디스플레이 반영 끝난 뒤 처리
    if (monster.hp < 1 || player.hp < 1) { break;}


  // 행동 메뉴 출력
    console.log(
      chalk.cyanBright(`
1. 등반하기        :  평범하게 등산합니다 .
2. 축지법 !        :  성공시 체력소모 없음  |  [${player.skillChance}%확률] 
3. 필살! 암벽등반! :  현재 충전: [${player.specialMovePoint}] |  ${player.specialMovePoint === 3 ? chalk.yellowBright(`필살 ! 사용가능!`) : chalk.cyanBright(`충전[3] 필요`)}
4. 지름길 개척     :  낮은 확률로 등산로를 패스합니다. `,
       ),
    );
    const choice = readlineSync.question('행동을 선택해 주세요. (1-4 입력) ');

    //행동 선택지
    switch (choice) {
      case '1' : // 1.  등반하기
      player.playerAttack(player,monster, logs);
      monster.monsterAttack(player,monster, logs);
      break;
      case '2' : // 2. 축지법 
      player.playerSkill(player,monster, logs);
      break;
      case '3' : // 3. 필살 !! 암벽등반 !
      await player.playerSpecialMove(player,monster, logs);
      break;
      case '4' : // 4. 지름길..
      await player.playerSkill2(player,monster, logs, stage);
      break;
      default :
      logs.push(chalk.green(`1-4 사이의 숫자를 입력해 주세요.`));
    }
  
  };
  
};



//스테이지 클리어 보상
 async function StageClear (player, monster, stage) {
  console.clear();
  console.log(chalk.magentaBright(`\n===================== 랜 덤 보 상 =====================`));
  console.log(
    chalk.cyanBright(` | 5 가지 종류의 랜덤한 보상 !!                     |`) +
    chalk.blueBright(`\n | 확률은 동일합니다 !  (아닐수도 있습니다...)     |`) +
    chalk.redBright( `\n | 필살 ! 암벽등반 ! 은 5~10회 등반을 시도합니다.  |`,
    ),
  );
  console.log(chalk.magentaBright(`=======================================================\n`));
  if (stage === 6 ) {
    console.log(chalk.cyanBright.bold(` 중간 BOSS : 급경사로 돌파 !! 보상을 5회 획득합니다.\n`));
    await delay(0.3)
     RandomReward(player, monster, stage);
     await delay(0.3)
     RandomReward(player, monster, stage);
     await delay(0.3)
     RandomReward(player, monster, stage);
     await delay(0.3)
     RandomReward(player, monster, stage);
     await delay(0.3)
     RandomReward(player, monster, stage);
     await delay(0.3)
  }else {
  console.log(chalk.cyanBright(`랜덤 보상을 3회 획득합니다.`));
  await delay(0.3)
   RandomReward(player, monster, stage);
   await delay(0.3)
   RandomReward(player, monster, stage);
   await delay(0.3)
   RandomReward(player, monster, stage);
   await delay(0.4)
}
}

// 랜덤 뽑기 보상 ~~ !
function RandomReward(player, monster, stage) {
  
  // Math.random()*100 // 80이상~ 60이상~ 40이상~ 20이상~ 0이상~
  let Reward = Math.random()*100+1
  // 일부 보상에 0.8 ~ 2.0 배율 적용
  let RewardMulty = ((Math.random()*1.2)+0.8).toFixed(1);
         
      // 보상 종류 1 : 회복
  if ( Reward >= 80) {
    let playerHpRestoration = Math.floor(RewardMulty*(stage*18+10))
    console.log(chalk.yellowBright(`산바람이 시원하다. 체력이 [${playerHpRestoration}] 회복되었다 !`));
    console.log(chalk.greenBright(`● 체력 [${player.hp}] ☞  [${ player.hp + playerHpRestoration}]`));
    player.hp += playerHpRestoration
    
    //보상 종류 2 : 공격력
  } else if ( Reward >= 60) {
    let playerPowerInc = Math.floor(RewardMulty*(stage*2+5))
    console.log(chalk.yellowBright(`근육이 늘었다. 최소 등산력이 [${playerPowerInc}] 증가했다 !`));
    console.log(chalk.greenBright(`● 등산력 [${player.power}] ☞  [${player.power + playerPowerInc}]`));
    player.power += playerPowerInc


    //보상 종류 3 : 공격 배율
  } else if ( Reward >= 40) {
    let playerPowerMulty = Math.floor(RewardMulty*(stage*2+7))
    console.log(chalk.yellowBright(`산에 버려진 무공비급을 찾았다. 최대배율이 [${playerPowerMulty}] 증가했다 !`));
    console.log(chalk.greenBright(`● 최대배율 [${player.powerMore}] ☞  [${player.powerMore + playerPowerMulty}]`));
    player.powerMore += playerPowerMulty


        //보상 종류 4 : 필살 충전
  } else if ( Reward >= 20) {
    if( player.specialMovePoint < 3) {
      console.log(chalk.yellowBright(`필살 ! 암벽등반 ! 충전이 1회 증가했다 !]`));
      console.log(chalk.greenBright(`● 필살 ! 충전 [${player.specialMovePoint}] ☞  [${player.specialMovePoint+1}]`));
      player.specialMovePoint++
    } else { 
    console.log(chalk.yellowBright(`필살 ! 암벽등반 충전 ! `)); 
    console.log(chalk.greenBright(`● 하지만, 이미 최대 충전 상태다... [3] ☞  [3]`));
  }
    //보상 종류 5 : 꽝으로 마무리?-> 축지법 성공률로 대체했다.
  } else {
    let skillChanceInc = Math.floor(3*RewardMulty);
    console.log(chalk.yellowBright(`보법이 달라졌다. 축지법 성공률이 ${skillChanceInc}% 증가했다 !`));
    console.log(chalk.greenBright(`● 축지법 성공률 [${player.skillChance}%] ☞  [${player.skillChance + skillChanceInc <= 75 ? player.skillChance + skillChanceInc : 75 }%]`));
    player.skillChance += skillChanceInc;
    if (player.skillChance >= 75) {
      console.log(chalk.greenBright(`축지법이 극에 달했습니다`), chalk.redBright(`... 축지법 상한치 : [75%]`));
      player.skillChance = 75 }

  }
};

// 게임시작 ~
export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 0; 

  // player.power = 111111111 // 테스트용 tttt
  // // stage = 10;             //테스트용
    while (stage <= 10) {

      //몬스터 생성
      let RandomName = ["오르막길", "내리막길", "칼바람 나락", "평범한 등산로", "등산로", "세 갈래 길", "세계의 눈물 중단2", "낙석주의", "고라니가 다니는 길", "챔피언스 로드",
          "한적한 등산로", "송전탑 아래", "단풍나무 아래", "누군가의 무덤을 지나서" , "계곡 길"];
      let RandomNameChoice = Math.floor(Math.random()*RandomName.length)
      
      const monster = new Monster(RandomName[RandomNameChoice], 70, 5);

      //10층 막보
      if ( stage % 10 === 0 && stage !== 0 ) {
      monster.name = "최종BOSS : 정상으로 향하는 길"
      monster.hp = 2999
      monster.attack = 180
      }
      //5층 중보
      else if ( stage % 5 === 0 && stage !== 0 ) {
      monster.name = "중간BOSS : 급경사로"
      monster.hp = 550
      monster.attack = 55
      }
      //일반 층
      else {
        monster.hp += stage*60+stage**3
        monster.attack += stage*1+stage**2
      }
    //배틀 진입
    await battle(stage, player, monster);


  
    // 패배 시
    if (player.hp < 1 ) {
      await gameover();
      readlineSync.keyIn('\n 스페이스 바를 눌러서 시작화면으로 돌아갑니다.');
      displayLobby();
      handleUserInput();
      break;
        }



    // 스테이지 승리
    if (monster.hp < 1 && stage < 10) {
      await monsterDefeat(player, stage);
      readlineSync.keyIn('\n스페이스바를 눌러서 보상 페이지로 !');

    }

  // 스테이지 클리어 처리
   stage++
   if(stage <=10 ){
    await StageClear(player, monster, stage);
    readlineSync.keyIn('\n 스페이스바를 눌러서 다음 스테이지로 !');
   }


  }
   
    // 10층 클리어 엔딩
    if(stage > 10) {
      await clearEnding();
    }

}

// 몬스터 처치
async function monsterDefeat (player, stage) {
console.log(chalk.yellowBright(`=================================`));
console.log(chalk.yellowBright(`${stage*100}M 구간 클리어 !`));
console.log(chalk.yellowBright(`휴식을 취해 체력이 ${stage*20+50} 만큼 회복되었다 !`));
player.hp += stage*20+100
console.log(chalk.yellowBright(`${stage*100+100}M 구간 진입`));
console.log(chalk.yellowBright(`=================================`));
}


// 패배시 엔딩
async function gameover () {
  console.log(chalk.yellowBright("체력이 모두 소모되었다......."));
  console.log(chalk.redBright("등산가는 눈앞이 깜깜해졌다......."));
 await delay(2);
 await TestText("GAME - OVER", 0.3, chalk.redBright)

}
// 엔딩 ..?
async function clearEnding () {
  await delay(1.6)
  await TestText("GAME-CLEAR!!", 0.12, chalk.yellowBright)
  await delay(0.3)
console.log(chalk.greenBright(`1000M 등산 완료 !`));
await delay(0.4)
console.log(chalk.cyanBright(`동네 뒷산을 정복했습니다.`));
await delay(0.4)
  readlineSync.keyIn('\n스페이스바를 눌러서 시작 화면으로 !');
  displayLobby();
  handleUserInput();

}


// TEST 문자 출력
async function TestText (text, setDelay, color) {
  let TestTextMes = ""
  for (let i = 0; i < text.length ; i++){
    console.clear()
    TestTextMes += text[i]
    console.log(color(('='.repeat(75))));
    console.log(color(figlet.textSync(TestTextMes)));
    console.log(color(('='.repeat(75))));

await delay(setDelay);
}
await delay(0.5);
}
