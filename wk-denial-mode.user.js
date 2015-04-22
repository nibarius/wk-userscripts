// ==UserScript==
// @name        WaniKani Denial Mode
// @version     1.0
// @author Niklas Barsk
// @description Make the dashboard look like you're level 50 and have burnt everything.
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/review/*
// @exclude     https://www.wanikani.com/lesson/*
// @updateURL   https://github.com/nibarius/wk-userscripts/raw/master/wk-denial-mode.user.js
// @run-at      document-end
// @copyright   2015, Niklas Barsk
// ==/UserScript==


var level = document.getElementsByClassName("dropdown-toggle")[0].children[0];
var lessons = document.getElementsByClassName("lessons")[0].getElementsByTagName("span")[0];
var reviews = document.getElementsByClassName("reviews")[0].getElementsByTagName("span")[0];
make(level,  "50");
make(lessons, "0");
make(reviews, "0");



if (isDashboard()) {
    var reviewStatus = document.getElementsByClassName("review-status")[0];
    var nextHour = reviewStatus.getElementsByClassName("one-hour")[0].children[0];
    var oneDay = reviewStatus.getElementsByClassName("one-day")[0].children[0];
    var nextReview = reviewStatus.getElementsByTagName("time")[0];
    make(nextHour, "0");
    make(oneDay, "0");
    make(nextReview, "&#8734;");

    fixSRSLevels("apprentice");
    fixSRSLevels("guru");
    fixSRSLevels("master");
    fixSRSLevels("enlightened");
    fixSRSLevels("burned");

    fixProgression();
}

function make(elem, what) {
	elem.innerHTML = what;
}

function fixSRSLevels(which) {
	var levelElement = document.getElementById(which);
	var data = levelElement.getAttribute("data-content");
    var fixedData = replaceInDataContent(which, data);
	levelElement.setAttribute("data-content", fixedData);

    var numberHolder = levelElement.children[0];
	if (which == "burned") {
        // 453 radicals
        // 1680 kanji
        // 5146 vocabulary
        make(numberHolder, "7279");
	}
    else {
        make(numberHolder, "0");
    }
}

function fixProgression() {
    var progression = document.getElementsByClassName("progression")[0];
    var radicalProgressTitle = progression.getElementsByTagName("h3")[0];
    var kanjiProgressTitle = progression.getElementsByTagName("h3")[1];
    replaceInProgressString(radicalProgressTitle);
    replaceInProgressString(kanjiProgressTitle);

    var radicalProgressBar = document.getElementsByClassName("bar")[0];
    radicalProgressBar.setAttribute("style", "width: 100%;");
    var kanjiProgressBar = document.getElementsByClassName("bar")[1];
    kanjiProgressBar.setAttribute("style", "width: 100%;");

    var radicalProgressBarLabel = radicalProgressBar.getElementsByTagName("b")[0]
    var kanjiProgressBarLabel = kanjiProgressBar.getElementsByTagName("b")[0]
    make(radicalProgressBarLabel, "100%");
    make(kanjiProgressBarLabel, "100%");
    
    var radicalTotal = document.getElementsByClassName("pull-right total")[0];
    var kanjiTotal = document.getElementsByClassName("pull-right total")[1];
    make(radicalTotal, "3"); // total radials for level 50
    make(kanjiTotal, "35"); // total kanji for level 50
}

function replaceInProgressString(which) {
	var splitString = which.innerHTML.split(/([0-9]+)/); //split on each number
    var newString = "";
    for (i = 0; i < splitString.length; i++) {
        if (isNaN(splitString[i])) {
            newString += splitString[i]; // not a number, just use it as it is
        }
        else {
        	newString += "50";
        }
    }
    make(which, newString);
}

function replaceInDataContent(which, data) {
    var splitString = data.split(/([0-9]+)/); //split on each number
    var newData = "";
    var burnCounter = 0;
    var burnCounts = ["453", "1680", "5146"];
    for (i = 0; i < splitString.length; i++) {
        if (isNaN(splitString[i])) {
            newData += splitString[i]; // not a number, just use it as it is
        }
        else if (which == "burned") {
            newData += burnCounts[burnCounter++];
        }
        else {
        	newData += "0";
        }
    }
    return newData;
}

function isDashboard() {
    return document.URL.indexOf("dashboard") != -1;
}
