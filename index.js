import data from "./data.js";
const table = document.querySelector("table");

console.log(data);

const CONSTRAINTS = {
	//Same person can not present more than 1 time in 1 date.
	notTwoTimesInARow: function (helpers) {
		if (helpers.person.agenda.findIndex((el) => el.date === helpers.currentDate) > -1) return 1; //IF PERSON ALREADY PRESENT IN THAT DAY -> TRUE
		return 0; // IF PERSON HASN'T BEEN WRITTEN TO THAT DAY -> FALSE
	},
};

function isRestrictedByConstraints(currentTableData, currentDate, person, people, assignments) {
	const helpers = { person, currentDate, currentTableData, people, assignments };
	for (let constraint in CONSTRAINTS) {
		// console.log(`Executing ${constraint} constraint, for person ${person.name}, on date ${currentDate}`);
		if (CONSTRAINTS[constraint](helpers)) return 1;
	}
	return 0;
}

function generateTableHead(table, inputData) {
	let thead = table.createTHead();
	let row = thead.insertRow();
	for (let key of inputData) {
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		th.appendChild(text);
		row.appendChild(th);
	}
}

function generateTable(table, inputData) {
	for (let element of inputData) {
		let row = table.insertRow();
		for (let key in element) {
			let cell = row.insertCell();
			let text = document.createTextNode(element[key]);
			cell.appendChild(text);
		}
	}
}

function determineTable(rawData) {
	const tableData = [];
	for (var i = 0; i < rawData.dates.length; i++) {
		let row = { date: rawData.dates[i] };
		for (var j = 0; j < rawData.assignments.length; j++) {
			let selectedPerson = pickRandomBestPerson(tableData, row.date, rawData.people, rawData.assignments);
			row[rawData.assignments[j]] = selectedPerson.name;
			selectedPerson.increaseWrittenCount();
			selectedPerson.subtractWrittenability(selectedPerson.writtenCount);
			selectedPerson.addAssignmentToAgenda({ date: row.date, assignment: rawData.assignments[j] });
		}
		tableData.push(row);
	}
	return tableData;
}

function write(table_DOM) {
	try {
		let tableData = determineTable(data);
		generateTable(table_DOM, tableData);
		generateTableHead(table_DOM, Object.keys(tableData[0]));
		console.log("BAŞARILI");
	} catch (e) {
		// console.error(e);
		setTimeout(() => {
			write(table_DOM);
		}, 0);
		return;
	}
}
write(table);

function randomBetween(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

console.log(data.people);

function pickRandomBestPerson(table_data, currentDate, people, assignments) {
	shuffle(people);
	let selectedPerson = findBetterOne(people[0], people);
	while (isRestrictedByConstraints(table_data, currentDate, selectedPerson, people, assignments)) {
		selectedPerson = findBetterOne(selectedPerson, people, true);
	}
	return selectedPerson;
}

function findBetterOne(person, people, hasToBeDifferent = false) {
	shuffle(people);
	if (hasToBeDifferent && people.length > 1) {
		const tmpPeople = [...people];
		tmpPeople.splice(tmpPeople.indexOf(person), 1);
		return pickRandomBestPerson(tmpPeople);
	}
	for (var i = 0; i < people.length; i++) {
		let comparisonPerson = people[i];
		if (comparisonPerson.writtenability > person.writtenability) return comparisonPerson;
	}
	return person;
}

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
