var hour=0,minute=0,second=0,millisecond=0;
var hourStr="00",minuteStr="00",secondStr="00",millisecondStr="000";
var interval;
var selfStopWatch;

class StopWatch{

	constructor(minTime,textId,startBtnId,stopBtnId,resetBtnId) {
		this.textId = textId;
		this.minTime = minTime;
		this.startBtnId = startBtnId;
		this.stopBtnId = stopBtnId;
		this.resetBtnId = resetBtnId;
		selfStopWatch = this;

		if(startBtnId != ""){
			document.getElementById(this.startBtnId).onclick=function(){

				selfStopWatch.startTime();
			}
		}
		if(startBtnId != ""){
			document.getElementById(this.stopBtnId).onclick=function(){
				selfStopWatch.stop();
			}
		}
		if(startBtnId != ""){
			document.getElementById(this.resetBtnId).onclick=function(){
				selfStopWatch.reset();
			}
		}
	}
														

	reset(){
		window.clearInterval(interval );
		millisecond=hour=minute=second=0;
		minuteStr="00",secondStr="00",hourStr="00",millisecondStr="000";
        //document.getElementById(this.textId).value='00:00:00.000';
        document.getElementById(this.textId).value='00:00:00';
	}
	
	
	//Start
	startTime(){
		window.clearInterval(interval );
		interval = setInterval(function(){

			selfStopWatch.timer();
		},this.minTime);
	}
	
	//Paused
	stop(){
		window.clearInterval(interval);
        return document.getElementById(this.textId).value;
	}
	
	

	timer(){
		millisecond=millisecond+this.minTime;
		if(millisecond<10){
			millisecondStr = "00"+millisecond;
		}else if(millisecond<100 && millisecond>=10){
			millisecondStr = "0"+millisecond;
		}else {
			if (millisecond == 1000){
				millisecondStr = "000"
			}else{
				millisecondStr = ""+millisecond;
			}
			
		}
	  
	  
		if(millisecond>=1000){
			millisecond=0;
			second=second+1;
			if(second<10){
				secondStr = "0"+second;
			}else{
				if (second == 60){
					secondStr = "00"
				}else{
					secondStr = ""+second;
				}
			}
		}
	  
		if(second>=60) {
			second=0;
			minute=minute+1;
				
			if(minute<10){
				minuteStr = "0"+minute;
			}else{
			
				if (minute == 60){
					minuteStr = "00"
				}else{
					minuteStr = ""+minute;
				}
			
			}
		}

		if(minute>=60){
			minute=0;
			hour=hour+1;
			if(hour<10){
				hourStr = "0"+hour;
			}else{
				hourStr = hour;
			}
		}
		//document.getElementById(this.textId).value=hourStr+':'+minuteStr+':'+secondStr+'.'+millisecondStr;
		document.getElementById(this.textId).value=hourStr+':'+minuteStr+':'+secondStr;

	}
	
}
	
