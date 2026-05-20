import { StatusBarItem, window, workspace } from "vscode";

export const searchToEndCommandID = "shadowReader.searchToEnd";
let myStatusBarItem: StatusBarItem = window.createStatusBarItem();
myStatusBarItem.command = searchToEndCommandID;

let lastReadText = '';
let showingText = '';
let timeoutInternal: NodeJS.Timeout | null = null;

function getBossText(): string {
    return <string>workspace.getConfiguration().get("shadowReader.bossText", "Hello world");
}

// 实际设置状态栏
function _setStatusBar(msg: string) {
    if (msg.length > 0) {
        myStatusBarItem.text = msg;
        showingText = msg;
        myStatusBarItem.show();
    } else {
        myStatusBarItem.hide();
    }
}

// 显示老板信息
function showBossText() {
    _setStatusBar(getBossText());
}

// 切换回正常信息
function showNormalText() {
    _setStatusBar(lastReadText);
    if (timeoutInternal) {
        clearTimeout(timeoutInternal);
    }
    let timeoutSecond = (<number>workspace.getConfiguration().get("shadowReader.hiddenTime")) * 1000;
    timeoutInternal = setTimeout(showBossText, timeoutSecond);
}

export function toggleBossMsg() {
    let bossText = getBossText();
    // 已经显示老板信息
    if (showingText === bossText) {
        showNormalText();
    } else {
        showBossText();
    }
}

export function setStatusBarMsg(msg: string) {
    lastReadText = msg;
    showNormalText();
}
