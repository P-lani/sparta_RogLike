import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {displayLobby} from "./server.js";
import {handleUserInput} from "./server.js";

//딜레이 함수
function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
  }


// 플레이어 초기값
 class Player {
  constructor() { 
    this.hp = 220;
    this.power = 18;
    this.powerMore = 20;
    this.skillChance = 35;
    this.specialMovePoint = 3; // 원활한 Test를 위해서 3으로 시작, 원래 0 시작입니다 !
  }
  // 플레이어의 공격
    async playerAttack (monster, logs) {
    let moveDis = Math.floor(this.power* ((Math.random()*this.powerMore/100)+1).toFixed(1));
    // 데미지 계산
    logs.push(chalk.green(`▲  ${moveDis}만큼 등반했다 !`));
    monster.hp = monster.hp - moveDis
    }


  // 축지법 스킬
  async playerSkill(logs) {
    logs.push(chalk.cyan(`●  축지법 성공 ! `));
 }
 
 
  // 필살기 !!
 async playerSpecialMove (monster, specialMoveCount, logs) {
      let total = 0;
            console.log(chalk.redBright(`필살 !!`)+chalk.yellow(`  암벽등반 ! ! ! ! `));
        await delay(0.4)
        for(let i = 0; i < specialMoveCount ; i++) {
          let moveDis = Math.floor(this.power* ((Math.random()*this.powerMore/100)+1).toFixed(1));
          monster.hp = monster.hp - moveDis
          console.log(chalk.redBright(`[${i+1}]회 ! `)+chalk.yellow(`${moveDis}M 등반!!`));
          total += moveDis
          await delay(0.14)
        }
        logs.push(chalk.cyanBright(`▲  총 [${total}M] 의 거리를 등반했다. `));
}



 // 지름길  일격기
  async playerSkill2 (monster, logs){
       await TestText("It's a one-hit KO!", 0.06, chalk.red, chalk.yellowBright)
      monster.hp = 0;
      console.log(chalk.yellowBright(`\n 지름길을 발견했다 !!`));
      readlineSync.keyIn('\n 스페이스바를 눌러주세요 !');
      logs.push(chalk.bgRedBright.bold(`일격필살 !`));
      
  }
}


// 몬스터 셋팅
export class Monster {
  constructor(name, hp, attack) {
    this.name = name
    this.hp = hp
    this.attack = attack
  }
 
  // 몬스터 일반 공격 
  monsterAttack(player, logs) {
    let monsterAttackRange = Math.floor(this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp - monsterAttackRange
    logs.push(chalk.green(`☞  체력 ${monsterAttackRange} 소모`));
  }

  // 몬스터 패턴 선택
  async monsterTurnChoice(player, logs) {
    let monsterPattern = Math.random()*100+1
    if (monsterPattern > 50) {
     await this.monsterNormalPattern(player, logs);
    } 
    else if (monsterPattern > 40) {
     await this.monsterPattern1(player, logs);

    }  
    else if (monsterPattern > 30) {
     await this.monsterPattern2(player, logs);
    }
    else if (monsterPattern > 10) {
      await this.monsterPattern3(player, logs);
     }
     else if (monsterPattern > 6) {
      await this.monsterPattern4(player, logs);
     }
     // 6% 
    else {
      logs.push(chalk.yellow(` ☞  ${this.name}의 공격 ! 하지만 빗나갔다 !! `));
      
    }

  }
  // 패턴 50% Normal
  async monsterNormalPattern(player, logs) {
    let monsterAttackRange = Math.floor(this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp- monsterAttackRange
    logs.push(chalk.yellow(` ◆  평범한 등반이었다. : 체력 ${monsterAttackRange} 소모 `));
    
  }

  // 패턴 10% (40>)
  async monsterPattern1(player, logs) {
    let monsterAttackRange = Math.floor(1.6*this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp- monsterAttackRange
    logs.push(chalk.yellow(` ◆  ${this.name}의 강력한 일격 ! ${monsterAttackRange}의 데미지를 입었다. [1.6배] `));

  } 
  // 패턴 10% (30>)
  async monsterPattern2(player, logs) {
    let monsterAttackRange = Math.floor(1.3*this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp- monsterAttackRange
    logs.push(chalk.yellow(` ◆ 앗! 돌부리에 걸려 넘어졌다.  체력 ${monsterAttackRange}소모 [1.3배] `));

  } 
  
  // 패턴 20% (10>)
  async monsterPattern3(player, logs) {
    let monsterAttackRange = Math.floor(0.6*this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp- monsterAttackRange
    logs.push(chalk.yellow(` ◆  쉬운 코스였다. : 체력 ${monsterAttackRange} 소모 [0.6배] `));

  } 
  // 패턴 4% (6>)
  async monsterPattern4(player, logs) {
    let monsterAttackRange = Math.floor(2.0*this.attack* ((Math.random()*40/100)+1).toFixed(1)); 
    player.hp = player.hp- monsterAttackRange
    logs.push(chalk.yellow(` ◆ ${this.name}이 지진을 사용했다 ! ${monsterAttackRange}의 데미지를 입었다. [2.0배] `));

  } 


}

// 상태창 함수
async function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n======================== 상태 정보창 ========================`));
  console.log(
    chalk.cyanBright(` | 현재 높이 | : ${stage*100} M 구간\n `) +
    chalk.blueBright( `| 플레이어 정보 | 체력: ${player.hp} 등산력: ${player.power} ~ ${Math.floor(player.power*(1+player.powerMore/100))} 최대배율 ${player.powerMore}\n`) +
    chalk.redBright( ` | ${monster.name} | 남은 거리: ${monster.hp} M  체력 소모량 : ${monster.attack}~${Math.floor(monster.attack*(1.4))}`,),
  );
  console.log(chalk.magentaBright(`=============================================================\n`));
}

// 화면 초기화
function displayReset(stage, player, monster, logs) {
console.clear();
displayStatus(stage, player, monster);
while(logs.length >14) {logs.shift();}
logs.forEach((log) => console.log(log));

}


// 배틀
const battle = async (stage, player, monster) => {
  let logs = [];


  // 마지막 턴의 계산까지 디스플레이를 하기 위한 방법?
  while(true) { //혼날것 같은 while true
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
      displayReset(stage, player, monster, logs);
      await delay(0.2)
      await player.playerAttack(monster, logs);
      displayReset(stage, player, monster, logs);
      await delay(0.2)
      await monster.monsterTurnChoice(player, logs)
      displayReset(stage, player, monster, logs);
      await delay(0.2)
      break;
      case '2' : // 2. 축지법 
      if(Math.random()*100 <= player.skillChance) {
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        player.playerSkill(logs);
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        player.playerAttack(monster, logs);
        displayReset(stage, player, monster, logs);
        await delay(0.2)
      } else {
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        logs.push(chalk.cyan(`▼ 축지법 실패다아아앗! 제자리 걸음 !`));
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        monster.monsterTurnChoice(player, logs);
        displayReset(stage, player, monster, logs);
        await delay(0.2)

      }
      
      break;
      case '3' : // 3. 필살 !! 암벽등반 !
      if(player.specialMovePoint === 3) {
        let specialMoveCount = Math.floor((Math.random()*5)+5);
      await player.playerSpecialMove(monster, specialMoveCount, logs);
        await delay(0.7)
      player.specialMovePoint = 0;
      displayReset(stage, player, monster, logs);
      await delay(0.3)
      logs.push(chalk.redBright(`★ 총 ${specialMoveCount} 회`)+chalk.yellow(` 연 속 등 반 ! ★ `));
      displayReset(stage, player, monster, logs);
      await delay(0.3)
      await monster.monsterTurnChoice(player, logs)
      displayReset(stage, player, monster, logs);
      await delay(0.3)
    }
     else {
      logs.push(chalk.green(`※ 필살 충전이 부족합니다. ☞ 현재 충전 : [${player.specialMovePoint}]`));
    }


      break;
      case '4' : // 4. 지름길..
      if( stage % 5 === 0 && stage !== 0) {
        logs.push(chalk.green(` 여기는 지름길을 찾을 수 없어 !`)+chalk.red(`  [BOSS전 사용 불가]`));
        }else {
        let playerSkill2Random = Math.floor(Math.random()*100+1)
        if ( playerSkill2Random >= 90) {
        await player.playerSkill2(monster, logs);
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        } else {
          displayReset(stage, player, monster, logs);
          await delay(0.2)
        logs.push(chalk.redBright(`지름길 개척 !`)+chalk.green(` 하지만, 실패했다 ! 제자리 걸음 !`));
        displayReset(stage, player, monster, logs);
        await delay(0.2)
        monster.monsterTurnChoice(player, logs);
        displayReset(stage, player, monster, logs);
        await delay(0.2)
      }
        }


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
    console.log(chalk.cyanBright.bold(` 중간 BOSS : 계단지옥 돌파 !! 보상을 5회 획득합니다.\n`));
    await delay(0.2)
    RandomReward(player, stage);
     await delay(0.2)
     RandomReward(player, stage);
     await delay(0.2)
     RandomReward(player, stage);
     await delay(0.2)
     RandomReward(player, stage);
     await delay(0.2)
     RandomReward(player, stage);
     await delay(0.2)
  }else {
  console.log(chalk.cyanBright(`랜덤 보상을 3회 획득합니다.`));
  await delay(0.5)
   RandomReward(player, stage);
   await delay(0.3)
   RandomReward(player, stage);
   await delay(0.3)
   RandomReward(player, stage);
   await delay(0.3)
}
}

// 랜덤 뽑기 보상 ~~ !
function RandomReward(player, stage) {
  
  // Math.random()*100 // 80이상~ 60이상~ 40이상~ 20이상~ 0이상~
  let Reward = Math.random()*100+1
  // 일부 보상에 0.8 ~ 2.0 배율 적용
  let RewardMulty = ((Math.random()*1.2)+0.8).toFixed(1);
         
      // 보상 종류 1 : 회복
  if ( Reward >= 80) {
    let playerHpRestoration = Math.floor(RewardMulty*(stage*15+10))
    console.log(chalk.yellowBright(`산바람이 시원하다. 체력이 [${playerHpRestoration}] 회복되었다 !`));
    console.log(chalk.greenBright(`● 체력 [${player.hp}] ☞  [${ player.hp + playerHpRestoration}]`));
    player.hp += playerHpRestoration
    
    //보상 종류 2 : 공격력
  } else if ( Reward >= 60) {
    let playerPowerInc = Math.floor(RewardMulty*(stage*3+7))
    console.log(chalk.yellowBright(`근육이 늘었다. 최소 등산력이 [${playerPowerInc}] 증가했다 !`));
    console.log(chalk.greenBright(`● 등산력 [${player.power}] ☞  [${player.power + playerPowerInc}]`));
    player.power += playerPowerInc


    //보상 종류 3 : 공격 배율
  } else if ( Reward >= 40) {
    let playerPowerMulty = Math.floor(RewardMulty*(stage*2+10))
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
      let RandomName = ["오르막길", "내리막길", "칼바람 나락", "평범한 등산로", "등산로", "세 갈래 길", "세계의 눈물 중단2", "고라니가 다니는길", "한적한 등산로", "송전탑 아래", "단풍나무 아래", "누군가의 무덤 근처" , "계곡", "산비탈", "레드 드래곤"];
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
      monster.name = "중간BOSS : 계단지옥"
      monster.hp = 777
      monster.attack = 77
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
      await displayLobby();
      await handleUserInput();
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
console.log(chalk.greenBright(`=======================================`));
console.log(chalk.yellowBright(`${stage*100}M 구간 클리어 !`));
console.log(chalk.yellowBright(`휴식을 취해 체력이 ${stage*20+200} 만큼 회복되었다 !`));
player.hp += stage*20+200
console.log(chalk.yellowBright(`${stage*100+100}M 구간 진입`));
console.log(chalk.greenBright(`=======================================`));
}


// 패배시 엔딩
async function gameover () {
  console.log(chalk.yellowBright("체력이 모두 소모되었다......."));
  console.log(chalk.redBright("등산가는 눈앞이 깜깜해졌다......."));
 await delay(2);
 await TestText("GAME - OVER", 0.3, chalk.redBright, chalk.white)

}
// 엔딩 ..?
async function clearEnding () {
  await delay(1.6)
  await TestText("GAME-CLEAR!!", 0.12, chalk.yellowBright, chalk.green.bind(chalk))
  await delay(0.3)
console.log(chalk.greenBright(`1000M 등산 완료 !`));
await delay(0.4)
console.log(chalk.cyanBright(`동네 뒷산을 정복했습니다.`));
await delay(0.4)
  readlineSync.keyIn('\n스페이스바를 눌러서 시작 화면으로 !');
 await displayLobby();
 await handleUserInput();

}


// TEST 문자열 앞에서부터 출력 (출력문자열, 출력지연(초), chalk.텍스트색상, chalk.===색상)
export async function TestText (text, setDelay, color, varcolor) {
  let TestTextMes = ""
  for (let i = 0; i < text.length ; i++){
    console.clear()
    TestTextMes += text[i]
    console.log(varcolor(('='.repeat(75))));
    console.log(color(figlet.textSync(TestTextMes)));
    console.log(varcolor(('='.repeat(75))));

await delay(setDelay);
}
await delay(0.5);
}

// TEST 문자 뒤에서부터 출력 (출력문자열, 출력지연(초), chalk.텍스트색상, chalk.===색상)
export async function TextMoveL (text, setDelay, color, varcolor) {
  let TestTextMes = ""
  for (let i = 0; i < text.length ; i++){
    console.clear();
    TestTextMes = text.slice(text.length-i-1,text.length)
    console.log(varcolor(('='.repeat(75))));
    console.log(color(figlet.textSync(TestTextMes, {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
  })));
    console.log(varcolor(('='.repeat(75))));

await delay(setDelay);
}
await delay(0.5);
}

