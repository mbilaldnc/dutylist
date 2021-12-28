const rawData = {
	title: "Nöbet Listesi",
	dates: [
		"01.12.2021",
		"02.12.2021",
		"03.12.2021",
		"04.12.2021",
		"05.12.2021",
		"06.12.2021",
		"07.12.2021",
		"08.12.2021",
		"09.12.2021",
		"10.12.2021",
		"11.12.2021",
		"12.12.2021",
		"13.12.2021",
		"14.12.2021",
		"15.12.2021",
		"16.12.2021",
		"17.12.2021",
		"18.12.2021",
		"19.12.2021",
		"20.12.2021",
		"21.12.2021",
		"22.12.2021",
		"23.12.2021",
		"24.12.2021",
		"25.12.2021",
		"26.12.2021",
		"27.12.2021",
		"28.12.2021",
		"29.12.2021",
		"30.12.2021",
		"31.12.2021",
	],
	assignments: [
		{ name: "Yeşil-1 (15 Saat)", duration: 15 },
		{ name: "Yeşil-2 L.H.SEP (15 Saat)", duration: 15 },
		{ name: "Sep-1 (16 Saat)", duration: 16 },
		{ name: "Sep-2 (16 Saat)", duration: 16 },
		{ name: "Sep-3 (16 Saat)", duration: 16 },
		{ name: "Pandemi Servis (24 Saat)", duration: 24 },
		{ name: "Sarı-1 (24 Saat)", duration: 24 },
		{ name: "Sarı-2 (24 Saat)", duration: 24 },
		{ name: "Sarı-3 (24 Saat)", duration: 24 },
		{ name: "Sarı-4 (24 Saat)", duration: 24 },
		{ name: "Sarı-5 (24 Saat)", duration: 24 },
	],
	people: [
		"Alperen G.",
		"Burak Ç.",
		"Burak G.",
		"Çağrı D.",
		"Çağrıhan C.",
		"Cem A.",
		"Cem K.",
		"Cem O. E.",
		"Çiğdem A.",
		"Dilek T.",
		"Ege E.",
		"Esra Y.",
		"Ezgi M.",
		"Faruk K.",
		"Fatma G.",
		"Gülbeddin A.",
		"Hilal A.",
		"İbrahim Y.",
		"Onur Ö.",
		"Serhat K.",
		"Şeyda A.",
		"Yeliz G.",
		"Ceyda Y.",
		"Emre F.",
		"Ferhat A.",
		"Hatice A.",
		"Mehmet S. A.",
		"Nazik Z. K.",
		"Onur Y.",
		"Pınar N. K.",
		"Şükran G.",
		"Şule K. D.",
		"Tuğçe D.",
		"Mahinur B. D.",
	],
};

class Person {
	constructor(name, writtenCount = 0, writtenability = 1000, workingHours = 0) {
		this.name = name;
		this.writtenCount = writtenCount;
		this.writtenability = writtenability;
		this.agenda = [];
		this.workingHours = workingHours;
	}
	increaseWrittenCount() {
		this.writtenCount++;
	}
	decraseWrittenCount() {
		this.writtenCount--;
	}
	setWrittenability(number) {
		this.writtenability = number;
	}
	subtractWrittenability(number) {
		this.writtenability -= number;
	}
	addWrittenability(number) {
		this.writtenability += number;
	}
	addAssignmentToAgenda(assignment) {
		this.agenda.push(assignment);
	}
	addWorkingHours(number) {
		this.workingHours += number;
	}
	removeFromAgendaByDate(date) {
		const index = this.agenda.findIndex((el) => el.date === date);
		if (index > -1) this.agenda.splice(index, 1);
		else {
			console.log(`Date ${date} not found for person ${this.name} to remove from agenda.`);
		}
	}
	removeFromAgendaByAssignment(assignment) {
		const index = this.agenda.findIndex((el) => el.assignment === assignment);
		if (index > -1) this.agenda.splice(index, 1);
		else {
			console.log(`Assignment ${assignment} not found for person ${this.name} to remove from agenda.`);
		}
	}
	setAgenda(arr) {
		this.agenda = [...arr];
	}
	reset() {
		this.writtenability = 100;
		this.agenda = [];
		this.writtenCount = 0;
		this.workingHours = 0;
	}
}

let refinedData = Object.assign({}, rawData);
refinedData.people = [];

for (var i = 0; i < rawData.people.length; i++) {
	refinedData.people.push(new Person(rawData.people[i]));
}

export default refinedData;
