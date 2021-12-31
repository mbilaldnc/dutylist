import data from "./data.js";
const table = document.querySelector("table");
const body = document.body;
const optionsDiv = document.querySelector("#options");

var count = 0;

const CONSTRAINTS = {
	everyOneIsEqual: function (helpers) {
		let maxWrittenabilityPerson = [...helpers.people].sort((a, b) => b.writtenability - a.writtenability)[0];
		if (CONSTRAINTS.checkForbiddenDates({ ...helpers, person: maxWrittenabilityPerson })) {
			maxWrittenabilityPerson.setTmpWrittenability(-Infinity);
			// console.log({ ...helpers, person: { ...maxWrittenabilityPerson } });
		}
		let highestWrittenability = Math.max(...helpers.people.map((person) => parseInt(person.writtenability)));
		// console.log("highestWrittenability", highestWrittenability);
		// console.log("current persons writtenability", helpers.person.writtenability);
		if (helpers.person.writtenability >= highestWrittenability - 1) return 0;
		return 1;
	},
	//Same person can not present more than 1 time in 1 date.
	notTwoTimesInARow: function (helpers) {
		if (helpers.person.agenda.some((el) => el.date === helpers.currentRowData.date)) return 1; //IF PERSON ALREADY PRESENT IN THAT DAY -> TRUE
		return 0; // IF PERSON HASN'T BEEN WRITTEN TO THAT DAY -> FALSE
	},
	howCanOneWorkFor24Hours: function (helpers) {
		let splittedDateString = helpers.currentRowData.date.split(".");
		let oneDayAgo = new Date(new Date(splittedDateString[2], splittedDateString[1], splittedDateString[0]).getDate() - 1).toLocaleDateString();
		if (helpers.person.agenda.some((assignment) => assignment.date === oneDayAgo && assignment.duration === 24)) return 1;
		return 0;
	},
	checkIsolates: function (helpers) {
		if (
			helpers.person.hasIsolates() &&
			Object.values(helpers.currentRowData).some((data) =>
				helpers.person.isolates.some((isolate) => isolate === helpers.people.find((person) => person.name === data))
			)
		) {
			helpers.person.setTmpWrittenability(-Infinity);
			return 1;
		}
		return 0;
	},
	checkForbiddenDates: function (helpers) {
		if (helpers.person.hasForbiddenDates() && helpers.person.forbiddenDates.some((date) => date === helpers.currentRowData.date)) return 1;
		return 0;
	},
};

function isRestrictedByConstraints(currentTableData, person, people, assignments, currentRowData) {
	const helpers = { person, currentTableData, people, assignments, currentRowData };
	for (let [name, constraint] of Object.entries(CONSTRAINTS)) {
		if (document.querySelector(`input[value="${name}"]`).checked && constraint(helpers)) return 1;
		// console.log(`Executing ${constraint} constraint, for person ${person.name}, on date ${currentDate}`);
	}
	return 0;
}

for (let key of Object.keys(CONSTRAINTS)) {
	const cb = document.createElement("input");
	cb.setAttribute("id", key);
	cb.setAttribute("type", "checkbox");
	cb.setAttribute("value", key);
	cb.setAttribute("checked", "true");
	const label = document.createElement("label");
	label.innerText = key;
	label.setAttribute("for", key);
	optionsDiv.appendChild(cb);
	optionsDiv.appendChild(label);
	optionsDiv.appendChild(document.createElement("br")); // HTML GOES BRRRRRR
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
			while (isRestrictedByConstraints(tableData, selectedPerson, dupPeople, rawData.assignments, row)) {
				// console.log("restriction encountered");
				if (dupPeople.length === 1) {
					console.error(`${count}. test başarısız.`);
					return 0;
				}
				dupPeople.splice(dupPeople.indexOf(selectedPerson), 1);
				selectedPerson = pickRandom(dupPeople);
			}
			for (let person of rawData.people) {
				person.turnEnded();
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

function generateIndividualTables(people) {
	for (let person of people) {
		const table = document.createElement("table");
		let thead = table.createTHead();
		let hrow = thead.insertRow();
		let hcell = document.createElement("th");
		hcell.colSpan = 3;
		hrow.appendChild(hcell);
		hcell.appendChild(document.createTextNode(person.name));
		let subHeadRow = thead.insertRow();
		for (let key of Object.keys(person.agenda[0])) {
			let subHeadCell = document.createElement("th");
			subHeadRow.appendChild(subHeadCell);
			subHeadCell.appendChild(document.createTextNode(key));
		}
		for (let assignment of person.agenda) {
			let row = table.insertRow();
			for (let value of Object.values(assignment)) {
				let cell = row.insertCell();
				cell.appendChild(document.createTextNode(value));
			}
		}
		let totalRow = table.insertRow();
		totalRow.insertCell().appendChild(document.createTextNode(person.agenda.length));
		totalRow.insertCell().appendChild(document.createTextNode(person.workingHours));
		const tableDiv = document.createElement("div");
		tableDiv.appendChild(table);
		document.querySelector("#individual-tables").appendChild(tableDiv);
	}
}

function write(table_DOM, rawData) {
	rawData.people[0].forbidDate("11.12.2021");
	rawData.people[0].forbidDate("12.12.2021");
	rawData.people[0].forbidDate("13.12.2021");
	rawData.people[0].forbidDate("14.12.2021");
	rawData.people[0].forbidDate("15.12.2021");
	rawData.people[0].forbidDate("16.12.2021");
	rawData.people[0].isolateFrom(rawData.people[1]);
	rawData.people[5].isolateFrom(rawData.people[11]);
	rawData.people[6].isolateFrom(rawData.people[2]);
	rawData.people[9].isolateFrom(rawData.people[15]);
	rawData.people[3].isolateFrom(rawData.people[20]);
	rawData.people[7].isolateFrom(rawData.people[13]);
	let tableData = generateTableData(rawData);
	while (tableData === 0 && count < 500) {
		for (let person of rawData.people) {
			person.reset();
		}
		tableData = generateTableData(rawData);
	}
	// data.people.sort((a, b) => b.agenda.length - a.agenda.length);
	data.people.sort((a, b) => b.workingHours - a.workingHours);
	generateTable(table_DOM, tableData);
	generateTableHead(table_DOM, Object.keys(tableData[0]));
	generateIndividualTables(rawData.people);
	console.log("BAŞARILI");
}

write(table, data);
console.log("people", data.people);
