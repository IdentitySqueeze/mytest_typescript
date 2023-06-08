import { assert } from "chai";
import { normalize} from 'path';
import { appendFileSync, existsSync, openSync, closeSync } from 'fs';
import { Utils } from '../Utils.js'
import { platform } from 'os';

var utils;

describe("utils test", function(){

    var logFilePath;
    if ((typeof process !== 'undefined') && 
    (process.release.name.search(/node|io.js/) !== -1)) {
        // this script is running in Node.js
        switch(platform()){
            case 'win32':
                logFilePath = normalize("C:\\Users\\Public\\mytest_logs\\mytest_typescript.log")
                break;
            case 'linux':
                logFilePath = normalize("/var/log/mytest_typescript.log")
                break;
       
         default:
            break;
        }
    } else {
        // this script is not running in Node.js.
        // Implication : browser. SKip file logging.
    }

    try{
        if(!existsSync(logFilePath)){
            let fh = openSync(logFilePath, 'a');
            closeSync(fh);
        }
        appendFileSync(logFilePath, `\nRunning unit tests at : ${new Date()}`);
        utils = new Utils(logFilePath);
    }catch(e){
        console.log(e);
        utils = new Utils();
    }

    function run_func_until_not(not_us:number[], func, max_tries:number, ...rest ){
        var rtn=not_us[0];
        let i:number=0;
        while(rtn in not_us){
            rtn=func(rest);
            i++;
            if(i==max_tries)
                return false;
        }
        return true;
    }

    // Unit test a 'passing' function isn't just returning the same val(s) over & over
    function not_fixated(not_us:number[], func:Function, ...args){
        return run_func_until_not(not_us, func, 250, [...args]);
    }

    // Unit test a 'passing' [from, to] function does return something other than [from] or [to]
    function not_bookend_biased(func:Function, ...args ){
        let [x,y, ...others]=args;
        if( x-y==1 || y-x==1 )
            return true;
        return run_func_until_not([x,y], func, 250, [...args]);
    }

    it("ri test", function(){
        function test_ri(x:number, y:number, bott:number, top:number){
            let num = utils.mytest_ri(x,y);
            assert.isAtLeast(num,bott);
            assert.isAtMost(num,top);
        }
        assert.isTrue(not_bookend_biased(utils.mytest_ri, [1,1]  ));
        assert.isTrue(not_bookend_biased(utils.mytest_ri, [5,10] ));
        assert.equal( utils.mytest_ri(2,2),2);
        assert.equal( utils.mytest_ri( 1, 1), 1);
        test_ri( -1,  1, -1,  1 );
        test_ri(  1, -1, -1,  1 );
        test_ri( -1, -1, -1, -1 );
        assert.equal( utils.mytest_ri( 0, 0), 0);
        test_ri( 1, 0,  0,  1);
        test_ri(-1, 0, -1,  0);
        test_ri( 0, 1,  0,  1);
        test_ri( 0,-1, -1,  0);
        assert.equal( utils.mytest_ri( 5, 5), 5);
        test_ri(-5, 5, -5,  5);
        test_ri( 5,-5, -5,  5);
        assert.equal( utils.mytest_ri(-5,-5), -5);
        test_ri( 5, 0,  0,  5);
        test_ri(-5, 0, -5,  0);
        test_ri( 0, 5,  0,  5);
        test_ri( 0,-5, -5,  0);
        test_ri( 6, 3,  3,  6);
        test_ri(-6, 3, -6,  3);
        test_ri( 6,-3, -3,  6);
        test_ri(-6,-3, -6, -3);
        test_ri( 3, 6,  3,  6);
        test_ri(-3, 6, -3,  6);
        test_ri( 3,-6, -6,  3);
        test_ri(-3,-6, -6, -3);
        test_ri(10,1,  1, 10);
        test_ri(100,10,10,100);
        test_ri(100,10, 10, 100);
        test_ri(1000,100, 100, 1000);
        test_ri(10000,1000, 1000, 10000);
        test_ri(100000,10000, 10000, 100000);
        test_ri(1000000,100000, 100000, 1000000);
        test_ri(-10,10, -10, 10);
        test_ri(-100,100, -100, 100);
        test_ri(-1000,1000, -1000, 1000);
        test_ri(-10000,10000, -10000, 10000);
        test_ri(-100000,100000, -100000, 100000);
        test_ri(-1000000,1000000, -1000000, 1000000);
        test_ri(10,-10, -10, 10);
        test_ri(100,-100, -100, 100);
        test_ri(1000,-1000, -1000, 1000);
        test_ri(10000,-10000, -10000, 10000);
        test_ri(100000,-100000, -100000, 100000);
        test_ri(1000000,-1000000, -1000000, 1000000);
        test_ri(-1,-10, -10, 1);
        test_ri(-10,-100, -100, 10);
        test_ri(-100,-1000, -1000, 100);
        test_ri(-1000,-10000, -10000, 1000);
        test_ri(-10000,-100000, -1000000, 10000);
        test_ri(-100000,-1000000, -1000000, 100000);
        test_ri(-5000000, 1, -5000000,1);
        test_ri(1, 5000000, 1, 5000000);
    });
    it("rd test", function(){
        function test_rd(x:number, y:number, z:number){
            let rslt:number = utils.mytest_rd( x,y,z );
            let rslt_split =rslt.toString().split('.') ;
            if (x>y){
                let tmp=y;
                y=x;
                x=tmp;
            }
            if (x==y){
                y++;
                if(x<0){
                    x--;
                }
            }
            z=Math.abs(z);
            assert.isAtLeast(rslt, x);
            assert.isAtMost(rslt, y);
            // if (rslt_split.length==1){
            //     assert.equal( 0, z );
            // }else{
            //     assert.equal(rslt_split.slice(-1)[0].length, z)
            // }
        }
        assert.isTrue(not_bookend_biased(utils.mytest_rd, [1,1,1] ));
        assert.isTrue(not_bookend_biased(utils.mytest_rd, [5,10,3]));
        assert.equal( utils.mytest_rd( 1, 1, 0), 1);
        test_rd(-1, 1, 0);
        test_rd( 1,-1, 0);
        assert.equal( utils.mytest_rd(-1,-1, 0), -1);
        assert.equal( utils.mytest_rd( 0, 0, 0),  0);
        test_rd( 1, 0, 0)
        test_rd(-1, 0, 0)
        test_rd( 0, 1, 0)
        test_rd( 0,-1, 0)
        assert.equal( utils.mytest_rd( 5, 5, 0), 5);
        test_rd(-5, 5, 0);
        test_rd( 5,-5, 0);
        assert.equal( utils.mytest_rd(-5,-5, 0), -5);
        test_rd( 5, 0, 0);
        test_rd(-5, 0, 0);
        test_rd( 0, 5, 0);
        test_rd( 0,-5, 0);
        test_rd( 6, 3, 0);
        test_rd(-6, 3, 0);
        test_rd( 6,-3, 0);
        test_rd(-6,-3, 0);
        test_rd( 3, 6, 0);
        test_rd(-3, 6, 0);
        test_rd( 3,-6, 0);
        test_rd(-3,-6, 0);
        test_rd( 1, 1, 1);
        test_rd(-1, 1, 1);
        test_rd( 1,-1, 1);
        test_rd(-1,-1, 1);
        test_rd( 0, 0, 1);
        test_rd( 1, 0, 1);
        test_rd(-1, 0, 1);
        test_rd( 0, 1, 1);
        test_rd( 0,-1, 1);
        test_rd( 5, 5, 1);
        test_rd(-5, 5, 1);
        test_rd( 5,-5, 1);
        test_rd(-5,-5, 1);
        test_rd( 5, 0, 1);
        test_rd(-5, 0, 1);
        test_rd( 0, 5, 1);
        test_rd( 0,-5, 1);
        test_rd( 6, 3, 1);
        test_rd(-6, 3, 1);
        test_rd( 6,-3, 1);
        test_rd(-6,-3, 1);
        test_rd( 3, 6, 1);
        test_rd(-3, 6, 1);
        test_rd( 3,-6, 1);
        test_rd(-3,-6, 1);
        test_rd( 1, 1, 4);
        test_rd(-1, 1, 4);
        test_rd( 1,-1, 4);
        test_rd(-1,-1, 4);
        test_rd( 0, 0, 4);
        test_rd( 1, 0, 4);
        test_rd(-1, 0, 4);
        test_rd( 0, 1, 4);
        test_rd( 0,-1, 4);
        test_rd( 5, 5, 4);
        test_rd(-5, 5, 4);
        test_rd( 5,-5, 4);
        test_rd(-5,-5, 4);
        test_rd( 5, 0, 4);
        test_rd(-5, 0, 4);
        test_rd( 0, 5, 4);
        test_rd( 0,-5, 4);
        test_rd( 6, 3, 4);
        test_rd(-6, 3, 4);
        test_rd( 6,-3, 4);
        test_rd(-6,-3, 4);
        test_rd( 3, 6, 4);
        test_rd(-3, 6, 4);
        test_rd( 3,-6, 4);
        test_rd(-3,-6, 4);
        test_rd( 1, 1, -4);
        test_rd(-1, 1, -4);
        test_rd( 1,-1, -4);
        test_rd(-1,-1, -4);
        test_rd( 0, 0, -4);
        test_rd( 1, 0, -4);
        test_rd(-1, 0, -4);
        test_rd( 0, 1, -4);
        test_rd( 0,-1, -4);
        test_rd( 5, 5, -4);
        test_rd(-5, 5, -4);
        test_rd( 5,-5, -4);
        test_rd(-5,-5, -4);
        test_rd( 5, 0, -4);
        test_rd(-5, 0, -4);
        test_rd( 0, 5, -4);
        test_rd( 0,-5, -4);
        test_rd( 6, 3, -4);
        test_rd(-6, 3, -4);
        test_rd( 6,-3, -4);
        test_rd(-6,-3, -4);
        test_rd( 3, 6, -4);
        test_rd(-3, 6, -4);
        test_rd( 3,-6, -4);
        test_rd(-3,-6, -4);
        test_rd( 10,1,0);
        test_rd( 100,10,0);
        test_rd( 1000,100,0);
        test_rd( 10000,1000,0);
        test_rd( 100000,10000,0);
        test_rd( 1000000,100000,0);
        test_rd( -10,10,0);
        test_rd( -100,100,0);
        test_rd( -1000,1000,0);
        test_rd( -10000,10000,0);
        test_rd( -100000,100000,0);
        test_rd( -1000000,1000000,0);
        test_rd( 10,-10,0);
        test_rd( 100,-100,0);
        test_rd( 1000,-1000,0);
        test_rd( 10000,-10000,0);
        test_rd( 100000,-100000,0);
        test_rd( 1000000,-1000000,0);
        test_rd( -1,-10,0);
        test_rd( -10,-100,0);
        test_rd( -100,-1000,0);
        test_rd( -1000,-10000,0);
        test_rd( -10000,-100000,0);
        test_rd( -100000,-1000000,0);
        test_rd(10,1,1);
        test_rd(100,10,1);
        test_rd(1000,100,1);
        test_rd(10000,1000,1);
        test_rd(100000,10000,1);
        test_rd(1000000,100000,1);
        test_rd(-10,10,1);
        test_rd(-100,100,1);
        test_rd(-1000,1000,1);
        test_rd(-10000,10000,1);
        test_rd(-100000,100000,1);
        test_rd(-1000000,1000000,1);
        test_rd(10,-10,1);
        test_rd(100,-100,1);
        test_rd(1000,-1000,1);
        test_rd(10000,-10000,1);
        test_rd(100000,-100000,1);
        test_rd(1000000,-1000000,1);
        test_rd(-1,-10,1);
        test_rd(-10,-100,1);
        test_rd(-100,-1000,1);
        test_rd(-1000,-10000,1);
        test_rd(-10000,-100000,1);
        test_rd(-100000,-1000000,1);
        test_rd(10,1,4);
        test_rd(100,10,4);
        test_rd(1000,100,4);
        test_rd(10000,1000,4);
        test_rd(100000,10000,4);
        test_rd(1000000,100000,4);
        test_rd(-10,10,4);
        test_rd(-100,100,4);
        test_rd(-1000,1000,4);
        test_rd(-10000,10000,4);
        test_rd(-100000,100000,4);
        test_rd(-1000000,1000000,4);
        test_rd(10,-10,4);
        test_rd(100,-100,4);
        test_rd(1000,-1000,4);
        test_rd(10000,-10000,4);
        test_rd(100000,-100000,4);
        test_rd(1000000,-1000000,4);
        test_rd(-1,-10,4);
        test_rd(-10,-100,4);
        test_rd(-100,-1000,4);
        test_rd(-1000,-10000,4);
        test_rd(-10000,-100000,4);
        test_rd(-100000,-1000000,4);
    });
    it("rfr test", function(){
        function test_rfr(x:number, y:number){
            let rslt = utils.mytest_rfr(x, y);
            assert.isTrue(Math.trunc(Math.log10(rslt[0])+1)==x && Math.trunc(Math.log10(rslt[1])+1)==y);
        }
        test_rfr( 2, 2 );
        test_rfr( 1, 1 );
        test_rfr( 1, 1 );
        test_rfr( 1, 2 );
        test_rfr( 1, 3 );
        test_rfr( 1, 4 );
        test_rfr( 1, 5 );
        test_rfr( 2, 1 );
        test_rfr( 3, 1 );
        test_rfr( 4, 1 );
        test_rfr( 5, 1 );
        test_rfr( 2, 3 );
        test_rfr( 2, 4 );
        test_rfr( 2, 5 );
        test_rfr( 2, 6 );
        test_rfr( 3, 2 );
        test_rfr( 4, 2 );
        test_rfr( 5, 2 );
        test_rfr( 6, 2 );
        test_rfr( 5, 6 );
        test_rfr( 5, 7 );
        test_rfr( 5, 8 );
        test_rfr( 5, 9 );
        test_rfr( 6, 5 );
        test_rfr( 7, 5 );
        test_rfr( 8, 5 );
        test_rfr( 9, 5 );
        let [num, denom] = utils.mytest_rfr( 2, 3 ).entries();
        assert.isTrue(not_fixated([num, denom], utils.mytest_rfr, [2, 3]));
        [num, denom] = utils.mytest_rfr( 1, 2 );
        assert.isTrue(not_fixated([num, denom], utils.mytest_rfr( 1, 2 )));
        [num, denom] = utils.mytest_rfr( 2, 2 );
        assert.isTrue(not_fixated([num, denom], utils.mytest_rfr( 2, 2 )));
        [num, denom] = utils.mytest_rfr( 3, 4 );
        assert.isTrue(not_fixated([num, denom], utils.mytest_rfr( 3, 4 )));
    });
    it("is prime test", function(){
        assert.isFalse(utils.mytest_isPrime(-1));
        assert.isFalse(utils.mytest_isPrime(0));
        assert.isFalse(utils.mytest_isPrime(1));
        assert.isTrue( utils.mytest_isPrime(2));
        assert.isTrue( utils.mytest_isPrime(3));
        assert.isFalse(utils.mytest_isPrime(4));
        assert.isTrue( utils.mytest_isPrime(5));
        assert.isFalse(utils.mytest_isPrime(6));
        assert.isTrue( utils.mytest_isPrime(7));
        assert.isFalse(utils.mytest_isPrime(8));
        assert.isFalse(utils.mytest_isPrime(9));
        assert.isFalse(utils.mytest_isPrime(10));
        assert.isTrue( utils.mytest_isPrime(11));
        assert.isFalse(utils.mytest_isPrime(12));
        assert.isTrue( utils.mytest_isPrime(13));
        assert.isFalse(utils.mytest_isPrime(14));
        assert.isFalse(utils.mytest_isPrime(15));
        assert.isFalse(utils.mytest_isPrime(16));
        assert.isTrue( utils.mytest_isPrime(17));
        assert.isFalse(utils.mytest_isPrime(18));
        assert.isTrue( utils.mytest_isPrime(19));
        assert.isFalse(utils.mytest_isPrime(20));
        assert.isFalse(utils.mytest_isPrime(21));
        assert.isFalse(utils.mytest_isPrime(22));
        assert.isTrue( utils.mytest_isPrime(23));
        assert.isTrue( utils.mytest_isPrime(31));
        assert.isFalse(utils.mytest_isPrime(33));
        assert.isTrue( utils.mytest_isPrime(37));
        assert.isTrue( utils.mytest_isPrime(41));
        assert.isTrue( utils.mytest_isPrime(43));
        assert.isTrue( utils.mytest_isPrime(47));
        assert.isFalse(utils.mytest_isPrime(51));
        assert.isTrue( utils.mytest_isPrime(53));
        assert.isFalse(utils.mytest_isPrime(57));
        assert.isTrue( utils.mytest_isPrime(61));
        assert.isFalse(utils.mytest_isPrime(63));
        assert.isTrue( utils.mytest_isPrime(67));
        assert.isTrue( utils.mytest_isPrime(71));
        assert.isTrue( utils.mytest_isPrime(73));
        assert.isFalse(utils.mytest_isPrime(77));
        assert.isFalse(utils.mytest_isPrime(81));
        assert.isTrue( utils.mytest_isPrime(83));
        assert.isFalse(utils.mytest_isPrime(87));
        assert.isFalse(utils.mytest_isPrime(91));
        assert.isFalse(utils.mytest_isPrime(93));
        assert.isTrue( utils.mytest_isPrime(97));
        assert.isTrue( utils.mytest_isPrime(101));
        assert.isTrue( utils.mytest_isPrime(103));
        assert.isTrue( utils.mytest_isPrime(107));
        assert.isTrue( utils.mytest_isPrime(151));
        assert.isFalse(utils.mytest_isPrime(153));
        assert.isTrue( utils.mytest_isPrime(157));
        assert.isFalse(utils.mytest_isPrime(501));
        assert.isTrue( utils.mytest_isPrime(503));
        assert.isFalse(utils.mytest_isPrime(507));
        assert.isFalse(utils.mytest_isPrime(1001));
        assert.isFalse(utils.mytest_isPrime(1003));
        assert.isFalse(utils.mytest_isPrime(1007));
        assert.isFalse(utils.mytest_isPrime(10001));
        assert.isFalse(utils.mytest_isPrime(10003));
        assert.isTrue( utils.mytest_isPrime(10007));
        assert.isFalse(utils.mytest_isPrime(100001));
        assert.isTrue( utils.mytest_isPrime(100003));
        assert.isFalse(utils.mytest_isPrime(100007));
        assert.isFalse(utils.mytest_isPrime(1000001));
        assert.isTrue( utils.mytest_isPrime(1000003));
        assert.isFalse(utils.mytest_isPrime(1000007));

    });
    it("prime factors test", function(){
        assert.sameMembers(utils.mytest_primeFactors(12), [2,2,3]);
        assert.sameMembers(utils.mytest_primeFactors(-1), [0]);
        assert.sameMembers(utils.mytest_primeFactors(0),  [0]);
        assert.sameMembers(utils.mytest_primeFactors(1),  [0]);
        assert.sameMembers(utils.mytest_primeFactors(2),  [2]);
        assert.sameMembers(utils.mytest_primeFactors(3),  [3]);
        assert.sameMembers(utils.mytest_primeFactors(4),  [2,2]);
        assert.sameMembers(utils.mytest_primeFactors(5),  [5]);
        assert.sameMembers(utils.mytest_primeFactors(6),  [2,3]);
        assert.sameMembers(utils.mytest_primeFactors(7),  [7]);
        assert.sameMembers(utils.mytest_primeFactors(8),  [2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(9),  [3,3]);
        assert.sameMembers(utils.mytest_primeFactors(10), [2,5]);
        assert.sameMembers(utils.mytest_primeFactors(11), [11]);
        assert.sameMembers(utils.mytest_primeFactors(12), [2,2,3]);
        assert.sameMembers(utils.mytest_primeFactors(13), [13]);
        assert.sameMembers(utils.mytest_primeFactors(14), [2,7]);
        assert.sameMembers(utils.mytest_primeFactors(15), [3,5]);
        assert.sameMembers(utils.mytest_primeFactors(16), [2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(17), [17]);
        assert.sameMembers(utils.mytest_primeFactors(18), [2,3,3]);
        assert.sameMembers(utils.mytest_primeFactors(19), [19]);
        assert.sameMembers(utils.mytest_primeFactors(20), [2,2,5]);
        assert.sameMembers(utils.mytest_primeFactors(30), [2,3,5]);
        assert.sameMembers(utils.mytest_primeFactors(40), [2,2,2,5]);
        assert.sameMembers(utils.mytest_primeFactors(50), [2,5,5]);
        assert.sameMembers(utils.mytest_primeFactors(60), [2,2,3,5]);
        assert.sameMembers(utils.mytest_primeFactors(70), [2,5,7]);
        assert.sameMembers(utils.mytest_primeFactors(80), [2,2,2,2,5]);
        assert.sameMembers(utils.mytest_primeFactors(90), [2,3,3,5]);
        assert.sameMembers(utils.mytest_primeFactors(100), [2,2,5,5]);
        assert.sameMembers(utils.mytest_primeFactors(4), [2,2]);
        assert.sameMembers(utils.mytest_primeFactors(8), [2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(16), [2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(32), [2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(64), [2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(128), [2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(512), [2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(1024), [2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(2048), [2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(4096), [2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(8192), [2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(16384), [2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(32768), [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(65536), [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(131072), [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(262144), [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
        assert.sameMembers(utils.mytest_primeFactors(524288), [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);

    });
    it("lcm test", function(){
        assert.equal( utils.mytest_lcm( [5] ), 5);
        assert.equal( utils.mytest_lcm( [0] ), 0);
        assert.equal( utils.mytest_lcm( [1] ), 1);
        assert.equal( utils.mytest_lcm( [1, 2] ), 2);
        assert.equal( utils.mytest_lcm( [1, 3, 2] ), 6);
        assert.equal( utils.mytest_lcm( [3, 1, 2] ), 6);
        assert.equal( utils.mytest_lcm( [3, 2, 1] ), 6);
        assert.equal( utils.mytest_lcm( [2, 3, 4] ), 12);
        assert.equal( utils.mytest_lcm( [2, 3, 4, 5] ), 60);
        assert.equal( utils.mytest_lcm( [2, 3, 7] ), 42);
        assert.equal( utils.mytest_lcm( [2, 4, 8] ), 8);
        assert.equal( utils.mytest_lcm( [3, 6, 9] ), 18);
        assert.equal( utils.mytest_lcm( [4, 16, 64] ), 64);
        assert.equal( utils.mytest_lcm( [16, 4, 64] ), 64);
        assert.equal( utils.mytest_lcm( [64, 16, 4] ), 64);
        assert.equal( utils.mytest_lcm( [7, 49, 349] ), 17101);
    });
    it("hcf test", function(){
        assert.equal( utils.mytest_hcf( [  5,  15,  30] ), 5);
        assert.equal( utils.mytest_hcf( [  5,  30,  15] ), 5);
        assert.equal( utils.mytest_hcf( [ 15,   5,  30] ), 5);
        assert.equal( utils.mytest_hcf( [ 15,  30,   5] ), 5);
        assert.equal( utils.mytest_hcf( [ 30,   5,  15] ), 5);
        assert.equal( utils.mytest_hcf( [ 30,  15,   5] ), 5);
        assert.equal( utils.mytest_hcf( [ 21,  35,   7] ), 7);
        assert.equal( utils.mytest_hcf( [ 12,  24,  48] ), 12);
        assert.equal( utils.mytest_hcf( [  9,  27, 126] ), 9);
        assert.equal( utils.mytest_hcf( [ -5,  15,  30] ), 5);
        assert.equal( utils.mytest_hcf( [  5, -15,  30] ), 5);
        assert.equal( utils.mytest_hcf( [  5,  15, -30] ), 5);
        assert.equal( utils.mytest_hcf( [ -5,  30,  15] ), 5);
        assert.equal( utils.mytest_hcf( [-15,   5,  30] ), 5);
        assert.equal( utils.mytest_hcf( [-15,  30,   5] ), 5);
        assert.equal( utils.mytest_hcf( [-30,   5,  15] ), 5);
        assert.equal( utils.mytest_hcf( [-30,  15,   5] ), 5);
        assert.equal( utils.mytest_hcf( [-21,  35,   7] ), 7);
        assert.equal( utils.mytest_hcf( [-12,  24,  48] ), 12);
        assert.equal( utils.mytest_hcf( [ -9,  27, 126] ), 9);

    });
    it("sq test", function(){
        assert.equal( utils.mylib_sq( 0, 0 ), 0 );
        assert.oneOf( utils.mylib_sq( 0, 1 ), [0,1]);
        assert.oneOf( utils.mylib_sq( 1, 0 ), [0,1]);
        assert.oneOf( utils.mylib_sq(-1, 0 ), [0,1]);
        assert.oneOf( utils.mylib_sq(-1, 1 ), [0,1]);
        assert.equal( utils.mylib_sq( 1, 1 ), 1 );
        assert.oneOf( utils.mylib_sq(-2, 2 ), [1,4]);
        assert.oneOf( utils.mylib_sq( 2, 2 ), [1,4]);
        assert.oneOf( utils.mylib_sq( 1, 2 ), [1,4]);
        assert.oneOf( utils.mylib_sq( 1, 3 ), [1,4,9]);
        assert.oneOf( utils.mylib_sq( 2, 5 ), [4,9,16,25]);
        assert.oneOf( utils.mylib_sq( 5, 10), [25,36,49,64,81,100]);
        assert.isTrue( not_fixated([25], utils.mylib_sq, [5, 10]));
        assert.isTrue( not_fixated([36], utils.mylib_sq, [5, 10]));
        assert.isTrue( not_fixated([49], utils.mylib_sq, [5, 10]));
        assert.isTrue( not_fixated([64], utils.mylib_sq, [5, 10]));
        assert.isTrue( not_fixated([81], utils.mylib_sq, [5, 10]));
        assert.isTrue( not_fixated([100], utils.mylib_sq, [5, 10]));
    });
    it("not sq test", function(){
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 0,   1 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 1,   0 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -1,   0 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -1,   1 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 1,   1 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -2,   2 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 2,   2 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 1,   2 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 1,   3 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 2,   5 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5,  10 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -50, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -50, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -50, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( -50, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );
        assert.isFalse( utils.mylib_isSquare( utils.mylib_notSquare( 5, 100 ) ) );

    });
    it("is square test", function(){
        assert.isFalse( utils.mylib_isSquare(  -1 ) );
        assert.isFalse( utils.mylib_isSquare(   0 ) );
        assert.isFalse( utils.mylib_isSquare(   1 ) );
        assert.isFalse( utils.mylib_isSquare(   2 ) );
        assert.isFalse( utils.mylib_isSquare(   3 ) );
        assert.isTrue(  utils.mylib_isSquare(   4 ) );
        assert.isFalse( utils.mylib_isSquare(  -4 ) );
        assert.isFalse( utils.mylib_isSquare(   5 ) );
        assert.isFalse( utils.mylib_isSquare(   6 ) );
        assert.isFalse( utils.mylib_isSquare(   7 ) );
        assert.isFalse( utils.mylib_isSquare(   8 ) );
        assert.isTrue(  utils.mylib_isSquare(   9 ) );
        assert.isFalse( utils.mylib_isSquare(  -9 ) );
        assert.isFalse( utils.mylib_isSquare(  10 ) );
        assert.isFalse( utils.mylib_isSquare( -10 ) );
        assert.isFalse( utils.mylib_isSquare(  11 ) );
        assert.isFalse( utils.mylib_isSquare(  12 ) );
        assert.isFalse( utils.mylib_isSquare(  13 ) );
        assert.isFalse( utils.mylib_isSquare(  14 ) );
        assert.isFalse( utils.mylib_isSquare(  15 ) );
        assert.isTrue(  utils.mylib_isSquare(  16 ) );
        assert.isFalse( utils.mylib_isSquare(  17 ) );
        assert.isFalse( utils.mylib_isSquare(  18 ) );
        assert.isFalse( utils.mylib_isSquare(  19 ) );
        assert.isFalse( utils.mylib_isSquare(  20 ) );
        assert.isTrue(  utils.mylib_isSquare(  25 ) );
        assert.isFalse( utils.mylib_isSquare(  26 ) );
        assert.isFalse( utils.mylib_isSquare(  35 ) );
        assert.isTrue(  utils.mylib_isSquare(  36 ) );
        assert.isFalse( utils.mylib_isSquare(  37 ) );
        assert.isFalse( utils.mylib_isSquare(  48 ) );
        assert.isTrue(  utils.mylib_isSquare(  49 ) );
        assert.isFalse( utils.mylib_isSquare(  50 ) );
        assert.isFalse( utils.mylib_isSquare(  51 ) );
        assert.isFalse( utils.mylib_isSquare(  53 ) );
        assert.isTrue(  utils.mylib_isSquare(  64 ) );
        assert.isFalse( utils.mylib_isSquare(  65 ) );
        assert.isFalse( utils.mylib_isSquare( 168 ) );
        assert.isTrue(  utils.mylib_isSquare( 169 ) );
        assert.isFalse( utils.mylib_isSquare( 170 ) );

    });
    it("int choose test", function(){
        assert.oneOf( utils.mylib_choose( [ -1,   -1 ] ), [-1   ] );
        assert.oneOf( utils.mylib_choose( [  1,   -1 ] ), [-1, 1] );
        assert.oneOf( utils.mylib_choose( [ -1,    1 ] ), [-1, 1] );
        assert.oneOf( utils.mylib_choose( [  1,    1 ] ), [ 1   ] );
        assert.oneOf( utils.mylib_choose( [  0,    0 ] ), [ 0   ] );
        assert.oneOf( utils.mylib_choose( [  0,    1 ] ), [ 0, 1] );
        assert.oneOf( utils.mylib_choose( [  0,   -1 ] ), [-1, 0] );
        assert.oneOf( utils.mylib_choose( [  1,    0 ] ), [ 0, 1] );
        assert.oneOf( utils.mylib_choose( [ -1,    0 ] ), [-1, 0] );
        assert.oneOf( utils.mylib_choose( [ 10,   11,   12,   13,   14 ] ), [10,11,12,13,14] );
        assert.oneOf( utils.mylib_choose( [100,  200,  300,  400,  500 ] ), [100,200,300,400,500] );
        assert.oneOf( utils.mylib_choose( [ 10, 10.1, 10.2, 10.3, 10.4 ] ), [10, 10.1, 10.2, 10.3, 10.4 ] );
        assert.oneOf( utils.mylib_choose( [  2,    4,    8,   16,   32, 64, 128, 256, 512, 1024, 2048, 8192, 16384, 32768, 65536 ] ),
                                           [2,    4,    8,   16,   32, 64, 128, 256, 512, 1024, 2048, 8192, 16384, 32768, 65536 ] );

    });
    it("int not test", function(){
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([0], utils.mytest_ri, 250,-1,1 ), 0);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);
        assert.notEqual( utils.mylib_not([5], utils.mytest_ri, 250, 4,6 ), 5);       ;
    });
    it("significant figures test", function(){
        assert.equal( utils.mylib_significant_figures(     0.0,     1), 0);
        assert.equal( utils.mylib_significant_figures(     1.0,     1), 1);
        assert.equal( utils.mylib_significant_figures(     1.1,     1), 1);
        assert.equal( utils.mylib_significant_figures(    11.0,     1), 10);
        assert.equal( utils.mylib_significant_figures(   111.0,     2), 110);
        assert.equal( utils.mylib_significant_figures(  1111.0,     3), 1110);
        assert.equal( utils.mylib_significant_figures(    11.1,     1), 10);
        assert.equal( utils.mylib_significant_figures(    11.11,    2), 11);
        assert.equal( utils.mylib_significant_figures(    11.111,   3), 11.1);
        assert.equal( utils.mylib_significant_figures(    11.1111,  4), 11.11);
        assert.equal( utils.mylib_significant_figures(     0.1,     1), 0.1);
        assert.equal( utils.mylib_significant_figures(     0.01,    1), 0.01);
        assert.equal( utils.mylib_significant_figures(     0.001,   1), 0.001);
        assert.equal( utils.mylib_significant_figures(     0.0001,  1), 0.0001);
        assert.equal( utils.mylib_significant_figures(    -1.0,     1), -1);
        assert.equal( utils.mylib_significant_figures(    -1.1,     1), -1);
        assert.equal( utils.mylib_significant_figures(   -11.0,     1), -10);
        assert.equal( utils.mylib_significant_figures(  -111.0,     2), -110);
        assert.equal( utils.mylib_significant_figures( -1111.0,     3), -1110);
        assert.equal( utils.mylib_significant_figures(   -11.1,     1), -10);
        assert.equal( utils.mylib_significant_figures(   -11.11,    2), -11);
        assert.equal( utils.mylib_significant_figures(   -11.111,   3), -11.1);
        assert.equal( utils.mylib_significant_figures(   -11.1111,  4), -11.11);
        assert.equal( utils.mylib_significant_figures(    -0.1,     1), -0.1);
        assert.equal( utils.mylib_significant_figures(    -0.01,    1), -0.01);
        assert.equal( utils.mylib_significant_figures(    -0.001,   1), -0.001);
        assert.equal( utils.mylib_significant_figures(    -0.0001,  1), -0.0001);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 1), 10000);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 2), 12000);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 3), 12300);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 4), 12350);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 5), 12345);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 6), 12345.1);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 7), 12345.12);
        assert.equal( utils.mylib_significant_figures( 12345.12345, 8), 12345.123);
        assert.approximately( utils.mylib_significant_figures( 12345.12345, 9), 12345.1235, 0.001);
        assert.equal( utils.mylib_significant_figures( 12345.12345,10), 12345.12345);
        assert.equal( utils.mylib_significant_figures(   123.123,   8), 123.123);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 1), -10000);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 2), -12000);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 3), -12300);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 4), -12350);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 5), -12345);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 6), -12345.1);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 7), -12345.12);
        assert.equal( utils.mylib_significant_figures(-12345.12345, 8), -12345.123);
        assert.approximately( utils.mylib_significant_figures( -12345.12345, 9), -12345.1235, 0.001);
        assert.equal( utils.mylib_significant_figures(-12345.12345,10), -12345.12345);
        assert.equal( utils.mylib_significant_figures(-123.123,     8), -123.123);

    });
    it("to sub test (DISABLED)", function(){
        return true;
        assert.equal( utils.mylib_toSub("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=()"),
                                  "ₐ₈CDₑբ₉ₕᵢⱼₖₗₘₙₒₚQᵣₛₜᵤᵥwₓᵧZₐ♭꜀ᑯₑբ₉ₕᵢⱼₖₗₘₙₒₚ૧ᵣₛₜᵤᵥwₓᵧ₂₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎");

    });
    it("to super test (DISABLED)", function(){
        return true;
        assert.equal( utils.mylib_toSuper("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=()"),
                                    "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾");

    });
    it("to standard form test (DISABLED)", function(){
        return true
        assert.equal( utils.mylib_toStandardForm(  111.11        ), "1.1111*10⁻²");
        assert.equal( utils.mylib_toStandardForm(  0.11111       ), "1.1111*10¹");
        assert.equal( utils.mylib_toStandardForm(  -0.11111      ), "-1.1111*10¹");
        assert.equal( utils.mylib_toStandardForm(  0             ), "0");
        assert.equal( utils.mylib_toStandardForm(  1             ), "1");
        assert.equal( utils.mylib_toStandardForm(  -1            ), "-1");
        assert.equal( utils.mylib_toStandardForm(  0.00012345    ), "1.2345*10⁴") //1.2344999999999997*10⁴;
        assert.equal( utils.mylib_toStandardForm(  0.0012345     ), "1.2345*10³") //1.2344999999999997*10³;
        assert.equal( utils.mylib_toStandardForm(  0.012345      ), "1.2345*10²") //1.2345000000000002*10²;
        assert.equal( utils.mylib_toStandardForm(  0.12345       ), "1.2345*10¹") //1.2345000000000002*10¹;
        assert.equal( utils.mylib_toStandardForm(  1.2345        ), "1.2345");
        assert.equal( utils.mylib_toStandardForm(  12.345        ), "1.2345*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  123.45        ), "1.2345*10⁻²");
        assert.equal( utils.mylib_toStandardForm(  1234.5        ), "1.2345*10⁻³");
        assert.equal( utils.mylib_toStandardForm(  12345.0       ), "1.2345*10⁻⁴");
        assert.equal( utils.mylib_toStandardForm(  -111.11       ), "-1.1111*10⁻²");
        assert.equal( utils.mylib_toStandardForm(  -0.11111      ), "-1.1111*10¹");
        assert.equal( utils.mylib_toStandardForm(  -0.00012345   ), "-1.2345*10⁴");
        assert.equal( utils.mylib_toStandardForm(  -0.0012345    ), "-1.2345*10³");
        assert.equal( utils.mylib_toStandardForm(  -0.012345     ), "-1.2345*10²");
        assert.equal( utils.mylib_toStandardForm(  -0.12345      ), "-1.2345*10¹");
        assert.equal( utils.mylib_toStandardForm(  -1.2345       ), "-1.2345");
        assert.equal( utils.mylib_toStandardForm(  -12.345       ), "-1.2345*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -123.45       ), "-1.2345*10⁻²");
        assert.equal( utils.mylib_toStandardForm(  -1234.5       ), "-1.2345*10⁻³");
        assert.equal( utils.mylib_toStandardForm(  -12345.0      ), "-1.2345*10⁻⁴");
        assert.equal( utils.mylib_toStandardForm(   9.9          ), "9.9");
        assert.equal( utils.mylib_toStandardForm(  -9.9          ), "-9.9");
        assert.equal( utils.mylib_toStandardForm(   10           ), "1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   10.0         ), "1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -10           ), "-1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -10.0         ), "-1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   10.01        ), "1.001*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -10.01        ), "-1.001*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   11           ), "1.1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   11.0         ), "1.1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -11           ), "-1.1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -11.0         ), "-1.1*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   11.01        ), "1.101*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(  -11.01        ), "-1.101*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(    0.9         ), "9*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.09        ), "9*10²");
        assert.equal( utils.mylib_toStandardForm(    0.009       ), "9*10³");
        assert.equal( utils.mylib_toStandardForm(    0.0009      ), "9*10⁴");
        assert.equal( utils.mylib_toStandardForm(    0.00009     ), "9*10⁵");
        assert.equal( utils.mylib_toStandardForm(   -0.9         ), "-9*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.09        ), "-9*10²");
        assert.equal( utils.mylib_toStandardForm(   -0.009       ), "-9*10³");
        assert.equal( utils.mylib_toStandardForm(   -0.0009      ), "-9*10⁴");
        assert.equal( utils.mylib_toStandardForm(   -0.00009     ), "-9*10⁵");
        assert.equal( utils.mylib_toStandardForm(    5           ), "5");
        assert.equal( utils.mylib_toStandardForm(    55          ), "5.5*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(    555         ), "5.55*10⁻²");
        assert.equal( utils.mylib_toStandardForm(    5555        ), "5.555*10⁻³");
        assert.equal( utils.mylib_toStandardForm(    55555       ), "5.5555*10⁻⁴");
        assert.equal( utils.mylib_toStandardForm(    555555      ), "5.55555*10⁻⁵");
        assert.equal( utils.mylib_toStandardForm(    5555555     ), "5.555555*10⁻⁶");
        assert.equal( utils.mylib_toStandardForm(    55555555    ), "5.5555555*10⁻⁷");
        assert.equal( utils.mylib_toStandardForm(    555555555   ), "5.55555555*10⁻⁸");
        assert.equal( utils.mylib_toStandardForm(   -5           ), "-5");
        assert.equal( utils.mylib_toStandardForm(   -55          ), "-5.5*10⁻¹");
        assert.equal( utils.mylib_toStandardForm(   -555         ), "-5.55*10⁻²");
        assert.equal( utils.mylib_toStandardForm(   -5555        ), "-5.555*10⁻³");
        assert.equal( utils.mylib_toStandardForm(   -55555       ), "-5.5555*10⁻⁴");
        assert.equal( utils.mylib_toStandardForm(   -555555      ), "-5.55555*10⁻⁵");
        assert.equal( utils.mylib_toStandardForm(   -5555555     ), "-5.555555*10⁻⁶");
        assert.equal( utils.mylib_toStandardForm(   -55555555    ), "-5.5555555*10⁻⁷");
        assert.equal( utils.mylib_toStandardForm(   -555555555   ), "-5.55555555*10⁻⁸");
        assert.equal( utils.mylib_toStandardForm(    0.5         ), "5*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.55        ), "5.5*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.555       ), "5.55*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.5555      ), "5.555*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.55555     ), "5.5555*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.555555    ), "5.55555*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.5555555   ), "5.555555*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.55555556  ), "5.5555556*10¹");
        assert.equal( utils.mylib_toStandardForm(    0.555555555 ), "5.55555555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.5         ), "-5*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.55        ), "-5.5*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.555       ), "-5.55*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.5555      ), "-5.555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.55555     ), "-5.5555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.555555    ), "-5.55555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.5555555   ), "-5.555555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.55555555  ), "-5.5555555*10¹");
        assert.equal( utils.mylib_toStandardForm(   -0.555555555 ), "-5.55555555*10¹");
    });
});

