import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame, Player, Monster} from "./game.js";

// 로비 화면을 출력하는 함수
export function displayLobby() {
    console.clear();

    console.log(chalk.greenBright('♣ '.repeat(37)));
    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('HIKING -1000 m ', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.cyanBright('='.repeat(73));
    console.log(chalk.greenBright('♣ '.repeat(37)));

    // 게임 이름
    console.log(line);
    console.log(chalk.yellowBright.bold('1000 m 등산을 목표로 '));
    console.log(chalk.yellowBright.bold('동네 뒷산을 등반하자 !'));

    // 설명 텍스트
    console.log(chalk.green('\n옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(line);
    console.log(chalk.blue('1.') + chalk.white(' 등산 시작'));
    console.log(chalk.blue('2.') + chalk.gray(' 업적 확인하기'));
    console.log(chalk.blue('3.') + chalk.gray(' 도움말'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
export function handleUserInput() {
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
function start() {
    displayLobby();
    handleUserInput();
}

// 게임 실행
start();
