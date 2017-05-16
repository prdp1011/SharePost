/**
 * Created by JASMINE-j on 5/14/2017.
 */

module.exports = {

    parseTime: function(time){
        return time;
    },

    getDaysBetweenTwoDates: function(start, end){
        if(!start)return 0;
        return parseInt((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    },

    getHoursBetweenTwoDates: function (start, end) {
        if(!start)return 0;
        return parseFloat(parseFloat((end.getTime() - start.getTime()) / (1000 * 3600)).toFixed(2));
    },

    getDaysInMonth: function(m, y) {
        return /8|3|5|10/.test(--m)?30:m==1?(!(y%4)&&y%100)||!(y%400)?29:28:31;
    },

    getTimeByMonthYear: function(d, m, y){
        return new Date(y, m, d);
    },

    getDateRangeByMonth : function(monthArray){
        var startDate = new Date(2017, 00, 1, 0, 0, 0);
        var startMonth = monthArray.length > 0 ? monthArray[0] : 0;
        var endMonth = monthArray.length > 0 ? monthArray[monthArray.length-1] : 0;
        return {startDate : new Date(2017,  startMonth, 1, 0, 0, 0), endDate : new Date(2017, endMonth+1, 0, 23, 59, 59)};
    },

    getMonthName: function(monthIndex){
        var data = ["January", "February", "March", "April", "May"];
        return data[monthIndex];
    },

    getDailyDate: function(startDate, endDate) {
        var dates = [];
        dates.push(HelperService.getDayStart(startDate));
        while(!HelperService.compareTodayDate(startDate, endDate)){
            startDate = HelperService.addDaysToDate(startDate, 1);
            dates.push(HelperService.getDayStart(startDate));
        }
        return dates;
    },

    getDealActiveDayCode: function(time){
        console.log(time);
        var d = time ? new Date(time)  : new Date();
        console.log(d);
        var day = d.getDay();
        var req = [];
        if(day == 0 || day == 6)req.push(3);
        if(day > 0 && day < 6)req.push(2);
        req.push(1);
        return req;
    },

    getTodayStart: function() {
        var today  = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    getNoOfDaysInMonth: function(year, month) {
        var lastDay = new Date(2017, month+1, 0, 23, 59, 59);
        console.log(lastDay);
        return lastDay.getDate();
    },

    getTodayEnd: function() {
        var today  = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    },
    getDayStart: function(date) {
        var date2 = new Date(date)
        return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    },

    getDayEnd: function(date) {
        var date2 = new Date(date)
        return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 23, 59, 59, 999);
    },
    getLastWeekStart: function(){
        var days = 7; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getLastDayStart: function(){
        var days = 1; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    addMonthsToDate: function(m){
        var date = new Date();
        var newDate = new Date(new Date(date).setMonth(date.getMonth() + m));
        return newDate;
    },

    get2HrsBefore: function(){
        var d = new Date();
        d.setHours(d.getHours() - 2);
        return d;
    },

    get2HrsAfter: function(){
        var d = new Date();
        d.setHours(d.getHours() + 2);
        return d;
    },

    getDateFormat: function(date){
        // 2016-08-01
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    },


    get30MinBefore: function(){
        var d = new Date();
        d.setMinutes(d.getMinutes() - 30);
        return d;
    },

    get24HrsBefore: function(){
        var d = new Date();
        d.setHours(d.getHours() - 24);
        return d;
    },

    get60secBefore: function(){
        var d = new Date();
        d.setSeconds(d.getSeconds() - 60);
        return d;
    },

    get5minBefore: function(){
        var d = new Date();
        d.setSeconds(d.getSeconds() - 300);
        return d;
    },

    getAppointmnetStatusValue: function(a){
        var data = ['Upcoming', 'Declined', 'Finished', 'OnGoing'];
        return data[a-1];
    },

    compareTodayDate: function(date1, date2){
        if(date1 == null)return true;
        var day1 = date1.getDate();
        var day2 = date2.getDate();
        var month1 = date1.getMonth();
        var month2 = date2.getMonth();
        var year1 = date2.getFullYear();
        var year2 = date2.getFullYear();
        if(day1 == day2 && month1 == month2 && year1 == year2)return true;
        else return false;
    },

    getNoOfDaysDiff : function(d1, d2){
        if(!d1)return 60;
        var diffMs = (d1.getTime()-d2.getTime());
        var diffDays = Math.round(diffMs / 86400000); // days
        return diffDays;
    },

    getTimeFromToday: function(time){
        var d = new Date();
        var diffMs = (d.getTime()-time.getTime());
        var diffDays = Math.round(diffMs / 86400000); // days
        var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        var months;
        months = (d.getFullYear() - time.getFullYear()) * 12;
        months -= time.getMonth() + 1;
        months += d.getMonth();
        months = months <= 0 ? 0 : months;
        if(months > 0)return months + ' month' + ( months > 1 ? 's' : '' ) + ' ago';
        else if(diffDays > 0)return diffDays + ' day' + ( diffDays > 1 ? 's' : '' ) + ' ago';
        else if(diffHrs > 0)return diffHrs + ' hour' + ( diffHrs > 1 ? 's' : '' ) + ' ago';
        else return diffMins + ' minute' + ( diffMins > 1 ? 's' : '' ) + ' ago';
    },

    getLastWeekEnd: function(){
        var days = 1; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59, 59, 999);
    },

    getLastMonthStart: function(){
        var days = 30; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getLastThreeMonthStart: function(){
        var days = 30 * 3; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getFirstDateOfMonth:function(y,m){
        return new Date(y,parseInt(m),1);
    },
    getLastDateOfMonth:function(y,m){
        return new Date(y,parseInt(m)+1,0);
    },

    addDaysToDate: function(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    getGenderName: function(index){
        if(index == 1) return "UNISEX";
        if(index == 2) return "MALE";
        if(index == 3) return "FEMALE";
    },

    getPaymentMethod: function(index){
        if(index == 1) return "Cash";
        if(index == 2) return "Card";
        if(index == 3) return "Advance Cash";
        if(index == 4) return "Advance Online";
        if(index == 5) return "Online Credit/ Debit Card, Net banking";
        if(index == 6) return "Paytm";
        if(index == 7) return "Paytm";
        if(index == 8) return "Amex";
        if(index == 9) return "Paytm";
        if(index == 10) return "Beu";
        if(index == 11) return "Nearby";
        if(index == 12) return "Paytm";
    },

    getDistanceBtwCordinates: function(lat1, lon1, lat2, lon2){
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2) ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return parseFloat(d.toFixed(1));
    },

    deg2rad: function(deg) {
        return deg * (Math.PI/180);
    },
};
