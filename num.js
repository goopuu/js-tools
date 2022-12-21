/**
 * 四舍五入
 * @param {*} num 
 * @param {*} decimal 
 * @param {*} needPad 是否需要填充 0 到指定小数位数
 * @returns 
 */
function round(num, decimal = 2, needPad = false)
{
    let numObj = _getIntNum(num)
    decimal = checkNum(decimal)

    let numString = numObj.intNumber + ''
    let exp = numObj.exp

    let result = 0
    if (decimal >= exp) {
        result = numObj.intNumber / Math.pow(10, numObj.exp)
    } else {
        let judgeNumIndex = numString.length - numObj.exp + decimal
        let judgeNum = +numString.charAt(judgeNumIndex)
        if ((judgeNum >= 0) && (judgeNum <= 4)) {
            result = +(numString.slice(0, judgeNumIndex)) / Math.pow(10, decimal)
        } else {
            result = (+(numString.slice(0, judgeNumIndex)) + 1) / Math.pow(10, decimal)
        }
    }
    if (needPad) {
        result = result.toString() + padZero(result, decimal)
    }

    return result
}

/**
 * 两个操作数的加、减、乘、除计算
 * @param {*} num1 
 * @param {*} num2 
 * @param {*} opt 
 * @returns 
 */
function calc(num1, num2, opt)
{
    let realNum1 = checkNum(num1)
    let realNum2 = checkNum(num2)
    let optArr = ['+', '-', '*', '/']

    let result = 0
    if (optArr.includes(opt)) {
        switch(opt) {
            case '+':
                result = _calcAdd(realNum1, realNum2)
                break
            case '-':
                result = _calcSub(realNum1, realNum2)
                break
            case '*':
                result = _calcMulti(realNum1, realNum2)
                break;
            case '/':
                result = _calcDiv(realNum1, realNum2)
                break
        }
    }

    return result
}

/**
 * 检测并返回数字类型
 * @param {numeric} num 
 * @returns 
 */
function checkNum(num)
{
    let realNum = +num

    return (isNaN(realNum) || !isFinite(realNum)) ? 0 : realNum;
}

/**
 * 将数字转换为整数，为了在之后的计算中有浮点数参数计算导致精度问题（整数的计算不会产生精度问题）
 * @param {*} num 
 * @returns 
 */
function _getIntNum(num)
{
    let result = { intNumber: 0, exp: 0 }
    let realNum = checkNum(num)
    realNum += ""
    let decimalIndex = _getDecimalIndex(realNum) + 1
    if (decimalIndex >= 0) {
        let exp = realNum.slice(decimalIndex).length
        let multi = Math.pow(10, exp)
        result.intNumber = realNum * multi
        result.exp = exp
    } else {
        result.intNumber = +realNum
    }

    return result
}

/**
 * 填充 0 到小数位数
 * @param {*} num 
 * @param {*} padLen 
 * @returns 
 */
function padZero(num, padLen)
{
    let realNum = checkNum(num) + ""
    let realPadLen = checkNum(padLen)

    let decimalIndex = _getDecimalIndex(realNum)
    let decimalSub = realNum.slice(decimalIndex + 1)
    let decimalLen = decimalSub.length

    let result = ""
    if (decimalLen < padLen) {
        if (decimalIndex < 0) {
            // 没有小数点
            for (let i = 0; i < padLen; i++) {
                result += "0"
            }
            result = "." + result
        } else {
            // 有小数点，并且小数位数小于需要填充的位数
            let diff = +(padLen - decimalLen)
            for (let i = 0; i < diff; i++) {
                result += "0"
            }
        }
    }
    // 小数位数大于需要填充的位数，不管

    return result
}

/**
 * 获取小数点索引
 * @param {*} num 
 * @returns 
 */
function _getDecimalIndex(num)
{
    let realNum = checkNum(num) + ""

    return +realNum.indexOf(".")
}

/**
 * 计算两个数相加
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function _calcAdd(num1, num2)
{
    let realNum1Obj = _getIntNum(num1)
    let realNum2Obj = _getIntNum(num2)
    let exp = Math.pow(10, +(realNum1Obj.exp + realNum2Obj.exp))

    return +(num1 * exp + num2 * exp) / exp
}

/**
 * 计算两个数相减
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function _calcSub(num1, num2)
{
    let realNum1Obj = _getIntNum(num1)
    let realNum2Obj = _getIntNum(num2)
    let exp = Math.pow(10, +(realNum1Obj.exp + realNum2Obj.exp))

    return +(num1 * exp - num2 * exp) / exp
}

/**
 * 计算两个数相乘
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function _calcMulti(num1, num2)
{
    let realNum1Obj = _getIntNum(num1)
    let realNum2Obj = _getIntNum(num2)
    let exp = Math.pow(10, +(realNum1Obj.exp + realNum2Obj.exp))

    return +(realNum1Obj.intNumber * realNum2Obj.intNumber) / exp
}

/**
 * 计算两个数相除
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function _calcDiv(num1, num2)
{
    let realNum1Obj = _getIntNum(num1)
    let realNum2Obj = _getIntNum(num2)
    let exp = Math.pow(10, Math.abs(+(realNum1Obj.exp - realNum2Obj.exp)))

    return round(+(realNum1Obj.intNumber / realNum2Obj.intNumber) * exp)
}