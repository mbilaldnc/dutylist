import data from "./data.js";
const table = document.querySelector("table");
const body = document.body;

console.log(data);

var count = 0;

const CONSTRAINTS = {
	//Same person can not present more than 1 time in 1 date.
	notTwoTimesInARow: function (helpers) {
		if (helpers.person.agenda.some((el) => el.date === helpers.currentDate)) return 1; //IF PERSON ALREADY PRESENT IN THAT DAY -> TRUE
		return 0; // IF PERSON HASN'T BEEN WRITTEN TO THAT DAY -> FALSE
	},
	everyOneIsEqual: function (helpers) {
		let highestWrittenability = Math.max(...helpers.people.map((person) => parseInt(person.writtenability)));
		// console.log("highestWrittenability", highestWrittenability);
		// console.log("current persons writtenability", helpers.person.writtenability);
		if (helpers.person.writtenability >= highestWrittenability - 1) return 0;
		return 1;
	},
	howCanOneWorkFor24Hours: function (helpers) {
		let splittedDateString = helpers.currentDate.split(".");
		let oneDayAgo = new Date(new Date(splittedDateString[2], splittedDateString[1], splittedDateString[0]).getDate() - 1).toLocaleDateString();
		if (helpers.person.agenda.some((assignment) => assignment.date === oneDayAgo && assignment.duration === 24)) return 1;
		return 0;
	},
};

for (let key of Object.keys(CONSTRAINTS)) {
	const cb = document.createElement("input");
	cb.setAttribute("id", key);
	cb.setAttribute("type", "checkbox");
	cb.setAttribute("value", key);
	cb.setAttribute("checked", "true");
	const label = document.createElement("label");
	label.innerText = key;
	label.setAttribute("for", key);
	body.appendChild(cb);
	body.appendChild(label);
	body.appendChild(document.createElement("br")); // HTML GOES BRRRRRR
}

function isRestrictedByConstraints(currentTableData, currentDate, person, people, assignments) {
	const helpers = { person, currentDate, currentTableData, people, assignments };
	for (let [name, constraint] of Object.entries(CONSTRAINTS)) {
		if (document.querySelector(`input[value="${name}"]`).checked && constraint(helpers)) return 1;
		// console.log(`Executing ${constraint} constraint, for person ${person.name}, on date ${currentDate}`);
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
		for (let name of Object.values(element)) {
			let cell = row.insertCell();
			let text = document.createTextNode(name);
			cell.appendChild(text);
		}
	}
}

function pickRandom(people) {
	return people[randomBetween(0, people.length - 1)];
}

function randomBetween(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function generateTableData(rawData) {
	count++;
	const tableData = [];
	for (var i = 0; i < rawData.dates.length; i++) {
		// console.log("tableData", [...tableData]);
		const date = rawData.dates[i];
		let row = { date };
		for (var j = 0; j < rawData.assignments.length; j++) {
			// console.log("current row", Object.assign({}, row));
			let dupPeople = [...rawData.people];
			let selectedPerson = pickRandom(dupPeople);
			while (isRestrictedByConstraints(tableData, date, selectedPerson, rawData.people, rawData.assignments)) {
				console.log("restriction encountered");
				if (dupPeople.length === 1) {
					console.error(`${count}. test başarısız.`);
					return 0;
				}
				dupPeople.splice(dupPeople.indexOf(selectedPerson), 1);
				selectedPerson = pickRandom(dupPeople);
			}
			row[rawData.assignments[j].name] = selectedPerson.name;
			selectedPerson.increaseWrittenCount();
			selectedPerson.subtractWrittenability(rawData.assignments[j].duration + 1);
			selectedPerson.addWorkingHours(rawData.assignments[j].duration);
			selectedPerson.addAssignmentToAgenda({ ...rawData.assignments[j], date: row.date });
		}
		tableData.push(row);
	}
	return tableData;
}

function write(table_DOM, rawData) {
	let tableData = generateTableData(rawData);
	while (tableData === 0) {
		for (let person of rawData.people) {
			person.reset();
		}
		tableData = generateTableData(rawData);
	}
	generateTable(table_DOM, tableData);
	generateTableHead(table_DOM, Object.keys(tableData[0]));
	console.log("BAŞARILI");
}

write(table, data);
console.log("people", data.people);
