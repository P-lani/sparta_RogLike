import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame, TextMoveL} from "./game.js";

function delay(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000))
    }
  
// 로비 화면을 출력하는 함수
export async function displayLobby() {
    await TextMoveL("HIKING - 1000 M", 0.08, chalk.black, chalk.black );
    console.clear();
    console.log(chalk.greenBright('♣ '.repeat(37)));
    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('HIKING - 1000 M ', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.cyanBright('='.repeat(73));
    console.log(chalk.greenBright('♣ '.repeat(37)));
    await delay(0.1);

    // 게임 이름
    console.log(line);
    await delay(0.1);
    console.log(chalk.yellowBright.bold('1000 m 등산을 목표로 '));
    await delay(0.1);
    console.log(chalk.yellowBright.bold('동네 뒷산을 등반하자 !'));
    await delay(0.1);
    // 설명 텍스트
    console.log(chalk.green('\n옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(line);
    await delay(0.1);
    console.log(chalk.blue('1.') + chalk.white(' 등산 시작'));
    await delay(0.1);
    console.log(chalk.blue('2.') + chalk.gray(' 업적 확인하기'));
    await delay(0.1);
    console.log(chalk.blue('3.') + chalk.gray(' 도움말'));
    await delay(0.1);
    console.log(chalk.blue('4.') + chalk.white(' 종료'));
    await delay(0.1);

    // 하단 경계선
    console.log(line);
    await delay(0.1);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
export async function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            // 여기에서 새로운 게임 시작 로직을 구현
            startGame();
            break;
        case '2':
            console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
            // 업적 확인하기 로직을 구현
            handleUserInput();
            break;
        case '3':
            // 도움말 
            console.log(chalk.blue('도움말을 오픈합니까?'));
            const doumMal = readlineSync.keyInYN('예(Y) / 아니오(N)');
            if(doumMal) {
                console.log(chalk.blue('하지만 미완성 입니다.'));
            } else { console.log(chalk.blue('도움말 열기 취소.'));}
            handleUserInput();
            break;
        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
async function start() {
   await  displayLobby(); 
   await handleUserInput();
}

// 게임 실행
start();
