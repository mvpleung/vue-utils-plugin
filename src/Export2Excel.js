/* eslint-disable */
require('./Blob');
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * check value type
 * @param  {String}  type
 * @param  {*}  val
 * @return {Boolean}
 */
function is(type, val) {
    return Object.prototype.toString.call(val) === ("[object " + type + "]")
}

function generateArray(table) {
    let out = [];
    let rows = table.querySelectorAll('tr');
    let ranges = [];
    for (let R = 0; R < rows.length; ++R) {
        let outRow = [];
        let row = rows[R];
        let columns = row.querySelectorAll('td');
        for (let C = 0; C < columns.length; ++C) {
            let cell = columns[C];
            let colspan = cell.getAttribute('colspan');
            let rowspan = cell.getAttribute('rowspan');
            let cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function(range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 } });
            };

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan)
                for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    let epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    let ws = {};
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    if (data.length > 0) {
        data = data.filter(item => item.length > 0);
        opts && opts.ignore && (data = data.map(item => {
            typeof opts.ignore === 'number' ? item.removeIndex(opts.ignore) : item.remove(opts.ignore);
            return item;
        }))
    }
    for (let R = 0; R != data.length; ++R) {
        for (let C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            let cell = { v: data[R][C] };
            if (cell.v == null) continue;
            let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

/**
 * 导出table到Excel表格
 * 
 * @param {String} id table标签ID 
 * @param {String} fileName 文件名
 * @param {Array/String} th 表头数组或表头选择器
 * @param {Object} opts 配置项目(忽略下标:{ignore: index})
 */
export function export_table_to_excel(id, fileName, th, opts) {
    let theTable = document.getElementById(id) || document.querySelector(id);
    let oo = generateArray(theTable);
    let ranges = oo[1];

    if (is('Object', th)) {
        opts = th;
        th = null;
    }
    if (th && typeof th === 'string' || !th) {
        let thels = th && typeof th === 'string' ? document.querySelectorAll(th) : theTable.querySelectorAll('th');
        if (thels && thels.length > 0) {
            th = [];
            thels.forEach(item => {
                th.push(item.innerText);
            });
        }
    }

    /* original data */
    let data = oo[0];
    th && data.unshift(th);
    saveExcel(data, ranges, fileName, opts);
}

/**
 * 导出JSON数组为Excel表格
 * 
 * @param {Array} th 表头 
 * @param {Array} jsonData 数据集合
 * @param {String} fileName 导出Excel 的文件名
 */
export function export_json_to_excel(th, jsonData, fileName) {

    /* original data */

    let data = jsonData;
    data.unshift(th);
    saveExcel(data, null, fileName);
}

function saveExcel(data, ranges, fileName, opts) {
    let ws_name = "SheetJS";

    let wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data, opts);
    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ranges && (ws['!merges'] = ranges);

    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return { 'wch': 10 };
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return { 'wch': val.toString().length * 2 };
            } else {
                return { 'wch': val.toString().length };
            }
        }))
        /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), (fileName || 'excel') + '.xlsx');
}