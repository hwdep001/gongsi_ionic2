declare global {
  interface Date {
    yyMMdd(): string;
    yyyy_MM_dd_HH_mm_ss (): string;
  }
}

Date.prototype.yyMMdd = function(): string {
  var yy = this.getFullYear().toString().slice(2, 4);
  var MM = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [yy,
          (MM>9 ? '' : '0') + MM,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

Date.prototype.yyyy_MM_dd_HH_mm_ss = function(): string {
  var yyyy = this.getFullYear();
  var MM = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();
  var HH = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();

  return [yyyy, "-",
          (MM>9 ? '' : '0') + MM, "-",
          (dd>9 ? '' : '0') + dd, " ",
          (HH>9 ? '' : '0') + HH, ":",
          (mm>9 ? '' : '0') + mm, ":",
          (ss>9 ? '' : '0') + ss
         ].join('');
};

export class CommonUtil {
    
    public static isStringEmpty(val: string): boolean {
      return (val == null || val == undefined || val.trim() == "") ? true : false;
    }
  
    public static isNumberEmpty(val: number): boolean {
      return (val == null || val == undefined) ? true : false;
    }
  
    public static shuffleArray(array: any[]): any[] {
      let m = array.length, t, i;
  
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
  
      return array;
    }
  }
  