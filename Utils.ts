import { primes } from "./primes.js";
import { appendFileSync } from 'fs';

export class Utils{
    logging;
    logFilePath;
    max_prime = Math.max(...primes);
    primes_count = primes.length;

    constructor(inlogFilePath?: string){
        if( typeof inlogFilePath !== undefined){
            this.logFilePath = inlogFilePath;
            this.logging = true;
        }else{
            this.logging = false;
        }
    }

    mylog(msg:string){
        if(this.logging){
            try{
                appendFileSync(this.logFilePath, `\n${msg}`);
            }catch(e){
                console.log(`\nError writing '${msg}' to the log file at '${this.logFilePath}'. Continuing.`);
            }
        }
    }

    mytest_ri(x: number, y: number, nonZero=true):number{
        try{
            if(x==y)
                return x;
            let rtn = 0;
            let signed = 1;
            if(x < 0 && y < 0){
                x=Math.abs(x);
                y=Math.abs(y);
                if(x>y){
                    let tmp=y;
                    y=x;
                    x=tmp;
                }
                do{
                    rtn = (Math.ceil(Math.random() * ( y - x ) + x)) * -1;
                }while(rtn == 0 && nonZero);
            }else if( x < 0 ){
                if(y==0){
                    do{
                        rtn=Math.ceil(Math.random() * Math.abs(x) ) * -1;
                    }while (rtn == 0 && nonZero);
                }else{
                    do{
                        rtn = Math.ceil(Math.random() * Math.abs(x) ) * -1;
                            + Math.ceil(Math.random() * y );
                    }while(rtn == 0 && nonZero);
                }
            }else if(y < 0){
                if(x==0){
                    do{
                        rtn = Math.ceil(Math.random() * Math.abs(y) ) * -1;
                    }while(rtn == 0 && nonZero);
                }else{
                    do{
                        rtn = Math.ceil(Math.random() * Math.abs(y) ) * -1;
                            + Math.ceil(Math.random() * x );
                    }while(rtn == 0 && nonZero);
                }
            }else{
                if(x>y){
                    let tmp=y;
                    y=x;
                    x=tmp;
                }
                let nudge=0;
                if(x==0)
                    nudge++;
                if(y==0)
                    nudge++;
                do{
                    rtn = (Math.ceil(Math.random() * ( (y+nudge) - (x+nudge) ) + (x+nudge)))-nudge;
                }while(rtn == 0 && nonZero);
            }
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mytest_rd(x: number, y:number, z:number, nonZero=true):number{
        try{
            //var a = new bigDecimal(12.6789);
            if(z==0)
                return this.mytest_ri(x,y);
            z=Math.abs(z);
            var dec = parseFloat(Math.random().toPrecision(z));
            var power = Math.pow(10,z);
            while(this.width(dec)-2 !=z || Math.round(dec * power - 0.5) % 10 ==0 || dec == 0)
                dec = parseFloat(Math.random().toPrecision(z));
            if (x==y){
                if(x<0){
                    dec--;
                }
                return ((x+dec)*power)/power;
            }
            let rtn:number = 0.0;
            var negBit:number=0.0;
            var posBit:number=0.0;
            if(x<0 && y<0){
                x=Math.abs(x);
                y=Math.abs(y);
                if(x>y){
                    var tmp = y;
                    y=x;
                    x=tmp;
                }
                if(y-x==1){
                    return(x+dec)*-1;
                }else{
                    while(nonZero && rtn==0)
                        rtn=(this.mytest_ri(x,(y-1))+dec)*-1;
                }
            }else if(x<0){
                if(y-x==1){ //  mytest_rd( -1, 0 )
                    rtn=dec*-1;
                }else if(y==0){
                    rtn=-1.0*(this.mytest_ri(0,Math.abs(x)-1)+dec);
                }else{
                    while(nonZero && rtn==0){
                        negBit = this.mytest_ri(0,Math.abs(x))*-1;
                        posBit = this.mytest_ri(0, y-1);
                        rtn = negBit+posBit+(1-dec);
                    }
                }
            }else if(y<0){
                if(x-y==1){
                    rtn=dec*-1;
                }else if(x==0){
                    rtn=-1.0*(this.mytest_ri(0,Math.abs(y)-1)+dec);
                }else{
                    while(nonZero && rtn==0){
                        negBit=(this.mytest_ri(0,Math.abs(y)))*-1;
                        posBit=this.mytest_ri(0,x-1);
                        rtn=(posBit+negBit)+(1-dec);
                    }
                }
            }else{
                if(x>y){
                    let tmp=y;
                    y=x;
                    x=tmp;
                }
                var nudge = 0;
                y-- // keeps the decimal portion in range
                if(x==0)
                    nudge++;
                if(y==0)
                    nudge++;
                while(nonZero&& rtn==0)
                    rtn=(this.mytest_ri(x+nudge, y+nudge)-nudge)+dec;
            }

            // unrepresentable floats -----------
            let prec:string = rtn.toPrecision(z + Math.trunc(rtn).toString().length);
            let newrtn = parseFloat(  rtn.toFixed(z))
            return parseFloat(parseFloat(prec).toFixed(z));
        }catch(e){
            console.log(e);
            throw(e);
        }
    }

    mytest_rfr(numWidth:number, denomWidth:number, proper=true){
        try{
            if (numWidth<=0 || denomWidth<=0 || numWidth>9 || denomWidth>9)
                throw new console.error("Argument(s) exception: rfr(${numWidth}, ${denomWidth})");
            
            var num = this.mytest_ri(Math.pow(10, numWidth-1), Math.pow(10, numWidth)-1);
            var denom = this.mytest_ri(Math.pow(10, denomWidth-1), Math.pow(10, denomWidth)-1);
            if( numWidth > denomWidth )
                proper=false;
            while (num >=denom && proper){
                num = this.mytest_ri(Math.pow(10, numWidth-1), Math.pow(10, numWidth)-1);
                denom = this.mytest_ri(Math.pow(10, denomWidth-1), Math.pow(10, denomWidth)-1);
            }
            return [num, denom];
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mytest_isPrime(x:number){
        try{
            if(x==2)
                return true;
            if(x<2)
                return false;
            if(x % 2 == 0 && x > 2)
                return false;
            if( x < this.max_prime){
                return primes.indexOf(x) != -1;
            }else{
                //for (3 to x)..
                for(var y=3; y<x; y++){
                    if( y % x ==0)
                        return false;
                    return true;
                }
            }
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mytest_primeFactors(x:number){
        try{
            if(x > 1048577)
                throw new console.error("Argument exception: primefactors(${x})");
            if(x<2)
                return [0];
            if(x<4)
                return[x];
            let rtnBackwards= [];
            let i = Math.max(Math.floor(x/Math.max((this.width(x)*2+2),1)),1)+5;
            while(i>=0){
                if( x % primes[i] == 0){
                    rtnBackwards.push(primes[i]);
                    x= Math.floor(x/primes[i]);
                    i = Math.max(Math.floor(x/(this.width(x)*2)),1)+5;
                }else{
                    i-=1;
                }
            }
            var rtn= rtnBackwards.reverse();
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    width(x:number):number{
        try{
            return Math.abs(x).toString().length;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    aJoin(x:number[]){
        try{
            for( let i=0; i<x.length; i+=1 )
            console.log(x[i])
        }catch(e){
            console.log(e);
            throw(e);
        }
    }

    mytest_lcm(x:number[]):number{
        try{
            let mult = 1;
            var x_abs = x.map(x=>Math.abs(x));
            for( let m=0; m<x_abs.length; m+=1)
                mult=mult*x_abs[m];
            if(mult > 150000000)
                throw new console.error("\nInput array too large: ${mult} - mytest_lcm");
            let rtn = mult;
            let skip = false;
            for(let i=mult; i>0; i-=1){
                skip = false;
                for(let j=0; j<x_abs.length; j++){
                    if(i % x_abs[j] != 0){
                        skip=true;
                        break;
                    }            
                }
                if(!skip)
                    rtn=i;
            }
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mytest_hcf(x:number[]):number{
        try{
            var x_abs = x.map(x=>Math.abs(x));
            let hcf=0;
            let bound = Math.min(...x_abs)+1;
            let skip = false;
            for(let i = 1; i<bound; i+=1){
                for(let j=0; j<x_abs.length; j++){
                    if( x_abs[j] % i != 0){
                        skip =true;
                        break;
                    }
                    if(!skip)
                        hcf = i;
                    skip = false;
                }
            }
            return hcf;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_sq(x:number,y:number):number{
        try{
            if(y<0)
                throw new console.error("\nArgument(s) exception: ${x}, ${y} in mylib_sq");
            if(x==0)
                return 0;
            var ran = this.mytest_ri(x,y);
            return Math.pow(ran,2);
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_isSquare(x:number){
        try{
            if(x<4)
                return false;
            return Number.isInteger(Math.sqrt(x));
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_notSquare(x:number, y:number):number{
        try{
            var rtn=4;
            while(this.mylib_isSquare(rtn)){
                rtn=this.mytest_ri(x,y);
                if(1==Math.abs(rtn))
                    break;
            }
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_choose(in_set:number[]):number{
        try{
            let indx = this.mytest_ri(1, in_set.length)-1;
            return in_set[ indx ];
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_not(not_me:number, x:number, y:number, func){
        try{
            var rtn=not_me;
            while(rtn==not_me)
                rtn=func(x,y);
            return rtn;    
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    //Return val type?
    mylib_significant_figures(x:number, figures:number):number{
        try{
            return parseFloat(x.toPrecision(figures));
            if(figures <1)
                throw new console.error("\nArgument(s)exception: mylib_significant_figures($(x), $(figures))");
            if(x==0)
                return 0;
            var rtn=Math.abs(x);
            var shifts=0;
            if(rtn<1.0){
                while(rtn<1.0){
                    rtn*=10;
                    shifts--;
                }
            }else{
                while(rtn>1.0){
                    rtn*=0.1;
                    shifts++;
                }
            }
            rtn*=Math.pow(10,figures);
            rtn =Math.round(rtn);
            rtn*=Math.pow(10,shifts-figures);
            if(x<0)
                rtn*-1;
            //return rtn.toPrecision(figures);
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_toSuper(s:string):string{
        try{
            let rtn:string="";
            for(let i=0; i<s.length; i++){
                switch(s[i]){
                    case '1':rtn = rtn.concat("¹"); break; 
                    case '2':rtn = rtn.concat("²"); break; 
                    case '3':rtn = rtn.concat("³"); break; 
                    case '4':rtn = rtn.concat("⁴"); break; 
                    case '5':rtn = rtn.concat("⁵"); break; 
                    case '6':rtn = rtn.concat("⁶"); break; 
                    case '7':rtn = rtn.concat("⁷"); break; 
                    case '8':rtn = rtn.concat("⁸"); break; 
                    case '9':rtn = rtn.concat("⁹"); break; 
                    case '0':rtn = rtn.concat("⁰"); break; 
                    case '-':rtn = rtn.concat("⁻"); break; 
                    case '+':rtn = rtn.concat("⁺"); break; 
                    case '*':rtn = rtn.concat("*"); break; 
                    case '/':rtn = rtn.concat("ᐟ"); break; 
                    case '\\':rtn = rtn.concat("ᐠ"); break; 
                    case 'a':rtn = rtn.concat("ᵃ"); break; 
                    case 'b':rtn = rtn.concat("ᵇ"); break; 
                    case 'c':rtn = rtn.concat("ᶜ"); break; 
                    case 'd':rtn = rtn.concat("ᵈ"); break; 
                    case 'e':rtn = rtn.concat("ᵉ"); break; 
                    case 'f':rtn = rtn.concat("ᶠ"); break; 
                    case 'g':rtn = rtn.concat("ᵍ"); break; 
                    case 'h':rtn = rtn.concat("ʰ"); break; 
                    case 'i':rtn = rtn.concat("ⁱ"); break; 
                    case 'j':rtn = rtn.concat("ʲ"); break; 
                    case 'k':rtn = rtn.concat("ᵏ"); break; 
                    case 'l':rtn = rtn.concat("ˡ"); break; 
                    case 'm':rtn = rtn.concat("ᵐ"); break; 
                    case 'n':rtn = rtn.concat("ⁿ"); break; 
                    case 'o':rtn = rtn.concat("ᵒ"); break; 
                    case 'p':rtn = rtn.concat("ᵖ"); break; 
                    case 'q':rtn = rtn.concat("۹"); break;
                    case 'r':rtn = rtn.concat("ʳ"); break; 
                    case 's':rtn = rtn.concat("ˢ"); break; 
                    case 't':rtn = rtn.concat("ᵗ"); break; 
                    case 'u':rtn = rtn.concat("ᵘ"); break; 
                    case 'v':rtn = rtn.concat("ᵛ"); break; 
                    case 'w':rtn = rtn.concat("ʷ"); break; 
                    case 'x':rtn = rtn.concat("ˣ"); break; 
                    case 'y':rtn = rtn.concat("ʸ"); break; 
                    case 'z':rtn = rtn.concat("ᶻ"); break; 
                    case 'A':rtn = rtn.concat("ᴬ"); break; 
                    case 'B':rtn = rtn.concat("ᴮ"); break; 
                    case 'C':rtn = rtn.concat("ᶜ"); break;
                    case 'D':rtn = rtn.concat("ᴰ"); break; 
                    case 'E':rtn = rtn.concat("ᴱ"); break; 
                    case 'F':rtn = rtn.concat("ᶠ"); break;
                    case 'G':rtn = rtn.concat("ᴳ"); break; 
                    case 'H':rtn = rtn.concat("ᴴ"); break; 
                    case 'I':rtn = rtn.concat("ᴵ"); break; 
                    case 'J':rtn = rtn.concat("ᴶ"); break; 
                    case 'K':rtn = rtn.concat("ᴷ"); break; 
                    case 'L':rtn = rtn.concat("ᴸ"); break; 
                    case 'M':rtn = rtn.concat("ᴹ"); break; 
                    case 'N':rtn = rtn.concat("ᴺ"); break; 
                    case 'O':rtn = rtn.concat("ᴼ"); break; 
                    case 'P':rtn = rtn.concat("ᴾ"); break; 
                    case 'R':rtn = rtn.concat("ᴿ"); break; 
                    case 'T':rtn = rtn.concat("ᵀ"); break; 
                    case 'S':rtn = rtn.concat("ˢ"); break; 
                    case 'U':rtn = rtn.concat("ᵁ"); break; 
                    case 'V':rtn = rtn.concat("ⱽ"); break; 
                    case 'W':rtn = rtn.concat("ᵂ"); break; 
                    case 'X':rtn = rtn.concat("ˣ"); break; 
                    case 'Y':rtn = rtn.concat("ʸ"); break; 
                    case 'Z':rtn = rtn.concat("ᶻ"); break; 
                    case '=':rtn = rtn.concat("⁼"); break; 
                    case '(':rtn = rtn.concat("⁽"); break; 
                    case ')':rtn = rtn.concat("⁾"); break; 
                    default: rtn = rtn.concat(s[i]);
                }
            }
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_toSub(s:string):string{
        try{
            let rtn:string="";
            for(let i=0; i<s.length; i++){
                switch(s[i]){
                    case '1': rtn = rtn.concat("₁"); break; 
                    case '2': rtn = rtn.concat("₂"); break; 
                    case '3': rtn = rtn.concat("₃"); break; 
                    case '4': rtn = rtn.concat("₄"); break; 
                    case '5': rtn = rtn.concat("₅"); break; 
                    case '6': rtn = rtn.concat("₆"); break; 
                    case '7': rtn = rtn.concat("₇"); break; 
                    case '8': rtn = rtn.concat("₈"); break; 
                    case '9': rtn = rtn.concat("₉"); break; 
                    case '0': rtn = rtn.concat("₀"); break; 
                    case '+': rtn = rtn.concat("₊"); break; 
                    case '-': rtn = rtn.concat("₋"); break; 
                    case '=': rtn = rtn.concat("₌"); break; 
                    case '(': rtn = rtn.concat("₍"); break; 
                    case ')': rtn = rtn.concat("₎"); break; 
                    case 'a': rtn = rtn.concat("ₐ"); break; 
                    case 'b': rtn = rtn.concat("♭"); break
                    case 'e': rtn = rtn.concat("ₑ"); break; 
                    case 'g': rtn = rtn.concat("₉"); break;
                    case 'h': rtn = rtn.concat("ₕ"); break;
                    case 'i': rtn = rtn.concat("ᵢ"); break;
                    case 'j': rtn = rtn.concat("ⱼ"); break;
                    case 'k': rtn = rtn.concat("ₖ"); break;
                    case 'l': rtn = rtn.concat("ₗ"); break;
                    case 'm': rtn = rtn.concat("ₘ"); break;
                    case 'n': rtn = rtn.concat("ₙ"); break;
                    case 'o': rtn = rtn.concat("ₒ"); break;
                    case 'p': rtn = rtn.concat("ₚ"); break;
                    case 'r': rtn = rtn.concat("ᵣ"); break;
                    case 's': rtn = rtn.concat("ₛ"); break;
                    case 't': rtn = rtn.concat("ₜ"); break;
                    case 'u': rtn = rtn.concat("ᵤ"); break;
                    case 'v': rtn = rtn.concat("ᵥ"); break;
                    case 'x': rtn = rtn.concat("ₐₓ"); break;
                    case 'A':rtn = rtn.concat("ₐ"); break; 
                    case 'B':rtn = rtn.concat("₈"); break; 
                    case 'E':rtn = rtn.concat("ₑ"); break; 
                    case 'F':rtn = rtn.concat("բ"); break;
                    case 'G':rtn = rtn.concat("₉"); break; 
                    case 'H':rtn = rtn.concat("ₕ"); break; 
                    case 'I':rtn = rtn.concat("ᵢ"); break; 
                    case 'J':rtn = rtn.concat("ⱼ"); break; 
                    case 'K':rtn = rtn.concat("ₖ"); break; 
                    case 'L':rtn = rtn.concat("ₗ"); break; 
                    case 'M':rtn = rtn.concat("ₘ"); break; 
                    case 'N':rtn = rtn.concat("ₙ"); break; 
                    case 'O':rtn = rtn.concat("ₒ"); break; 
                    case 'P':rtn = rtn.concat("ₚ"); break; 
                    case 'R':rtn = rtn.concat("ᵣ"); break; 
                    case 'T':rtn = rtn.concat("ₜ"); break; 
                    case 'S':rtn = rtn.concat("ₛ"); break; 
                    case 'U':rtn = rtn.concat("ᵤ"); break; 
                    case 'V':rtn = rtn.concat("ᵥ"); break; 
                    case 'W':rtn = rtn.concat("w"); break; 
                    case 'X':rtn = rtn.concat("ₓ"); break; 
                    case 'Y':rtn = rtn.concat("ᵧ"); break; 
                    case 'Z':rtn = rtn.concat("Z"); break; 
                    default:  rtn = rtn.concat(s[i]); 
                    break;            
                }
            }
            return rtn;
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }

    mylib_toStandardForm(n:number) :string {
        try{
            if(n==0)
                return "0";
            if(n==1)
                return "1";
            if(n==-1)
                return "-1";
            let sign:number = n < 0 ? -1 : 1;
            let expSigned:boolean = n < 1 ? false : true;
            let i:number = 0;
            if(Math.abs(n)>=1.0 && Math.abs(n) < 10.0){
                return String(n);
            }
            n=Math.abs(n);
            let shifts:number=0;
            if(n<1){
                while(n<1.0){
                    n*=10.0;
                    shifts++;
                }
            }else{
                while(n>10.0){
                    n/=10.0;
                    shifts++;
                }
            }
            return String(n*sign) + "*10" + this.mylib_toSuper((expSigned?"-":"")+String(shifts))
        }catch(e){
            console.log(e);
            this.mylog(e.message);
            throw(e);
        }
    }
}

//export default new Utils();
// export { mytest_ri, mytest_rd, mytest_rfr, mytest_isPrime, mytest_primeFactors, mytest_lcm,
//     mytest_hcf, mylib_sq, mylib_isSquare, mylib_notSquare, mylib_choose, mylib_not, 
//     mylib_significant_figures, mylib_toSuper, mylib_toSub, mylib_toStandardForm}