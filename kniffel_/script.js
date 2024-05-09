
let score = 0;
let checkBonus = 0;
let rolled = 0;
let values = [];

function rollDices() {

	if(checkGameEnd())
	{
		alert('Game ended! All fields are filled. Your score - ' + score);
		return ;
	}
	let dices = document.getElementsByClassName('dice');
	/*
		3. Pro Runde sind maximal drei Würfe erlaubt.
		Spätestens jetzt müssen die Würfel einem freien
		Punktefeld zugewiesen werden.
	*/
	if(rolled < 3)
	{
		values = [];
		for (let i = 0; i < dices.length; i++) {
			/*
				1. Wird ein Würfel gehalten, darf dieser nicht
			 gewürfelt werden, wenn man auf den Button "Würfeln"
			 klickt.
			*/

			if(!(dices[i].getAttribute("data-hold")))
			{
				dices[i].value = Math.floor((Math.random() * 6) + 1);
			}

			let value = parseInt(dices[i].value);
			values.push(value);
		}

		rolled++;
	}
}


function assignDices(field, type) {

	/*
		2. Wurde ein Punktefeld bereits ausgewählt, z.B. Einser,
	darf man hier kein weiteres mal Punkte zuweisen.
	*/

	if(rolled > 0) // Vermeidung einer leeren Zuweisung vor dem Wurf
	{

		if (field.innerHTML !== "") {
			console.log("This field is already filled.");
			//alert('This field  is already filled.'); - more annoying
			return;
		}

		let points = 0;

		switch (type) {
			case 1:
			case 2:
			/*
				6. Erweitern Sie die Wertetabelle und Funktionalität,
				damit auch Dreier, Vierer, Fünfer und Sechser
				ausgewählt werden können.
			*/
			case 3:
			case 4:
			case 5:
			case 6:
				points = getEinserBisSechser(type);
				checkBonus += points;
				break;

			case 'Dreierpasch':
				points = getPasch(3);
				break;

			case 'Viererpasch':
				points = getPasch(4);
				break;
			case 'Full House':
				points = fullHouse();
				break;
			case 'kleine Straße':
				points = checkStrasse(1);
				break;
			case 'große Straße':
				points = checkStrasse(2);
				break;
			case 'Kniffel':
				points = calculateKniffel();
				break;
			case 'Chance':
				points = calculateChance();
		}

		/*
		10. Wenn die Würfel einem Punktefeld zugewiesen werden,
		merken Sie sich in einer frei wählbaren Form, welche
		fünf Würfelwerte es zu diesem Zeitpunkt sind, so dass
		jederzeit nachvollzogen werden kann, welche fünf
		Würfelwerte zum Zeitpunkt der Zuweisung für z.B.
		Dreierpasch verwendet wurden.
		*/
		if(field.innerHTML == "")
		{
			field.innerHTML = points + " (" + values + ")";

		}

		/*
		14. Wenn die Gesamtpunktzahl aller
		eingetragenen Punkte von Einser bis
		Sechser mindestens 63 ist, dann erhält
		man 35 Bonuspunkte.
		*/
		if(checkBonus >= 63)
		{
			document.getElementById('bonus').innerHTML = 35;
			score+= 35;
			checkBonus = 0;
		}
		score += points;
		document.getElementById('score').innerHTML = score;

		resetRound();
	}
}

function getEinserBisSechser(num) {

	let points = 0;

	for (let i = 0; i < values.length; i++) {
		if (values[i] == num) {
			points += num;
		}
	}

	return points;
}
/*
	9. Berechnen Sie einen Dreier- und Viererpasch.
*/
function getPasch(num) {
	let points = 0;
	let counts = [0, 0, 0, 0, 0];
	let howMany = 0;
	let amount = 0;

	for(let i = 0; i < values.length; i++)
	{
		counts[values[i] - 1] += 1;
	}

	for(let i = 0; i < counts.length; i++)
	{
		if(counts[i] > howMany)
		{
			howMany = counts[i]
			amount = i + 1;
		}
	}

	if(howMany >= num)
	{
		points = howMany * amount;
	}
	return points;
}
 /*
 	11. Berechnen Sie ein Fullhouse.
 */
function fullHouse()
{
	let sortedValues = values.slice().sort();

	 let isFullHouseCombo =
		 (sortedValues[0] === sortedValues[1] && sortedValues[1] === sortedValues[2] && sortedValues[3] === sortedValues[4]) ||
		 (sortedValues[0] === sortedValues[1] && sortedValues[2] === sortedValues[3] && sortedValues[3] === sortedValues[4]);

	if(isFullHouseCombo)
		return 25;
	else
		return 0;
}
/*
	12. Berechnen Sie eine kleine und große Straße.
*/
function checkStrasse(size)
{
	let sortedValues = values.slice().sort();
	let strasseCount = 1;
	let res = 0;

	for(let i = 0; i < sortedValues.length - 1; i++)
	{
		if(sortedValues[i + 1] - sortedValues[i] == 1)
		{
			strasseCount++;
		} else
		{
			if(sortedValues[i + 1] != sortedValues[i])
			{
				if(size == 2 && (i + 1) == sortedValues.length)
					strasseCount = 0;
			}
		}
	}

	if(strasseCount >= 4 && size == 1)
		res = 30;
	else if(strasseCount == 5 && size == 2)
		res = 40;
	return res;
}
/*
	13. Berechnen Sie Kniffel und Chance.
*/
function calculateKniffel()
{
	for(let i = 0; i < values.length - 1; i++)
	{
		if(values[i] != values[i + 1])
			return 0;
	}
	return 50;
}
/*
 und Chance.
*/
function calculateChance()
{
	let sum = 0;
	for(let i = 0; i < values.length; i++)
	{
		sum += values[i];
	}
	return sum;
}
/*
	15. Stellen Sie fest, dass das Spiel
beendet ist (alle Punktefelder wurden gesetzt)
und stellen diesen Zustand optisch dar.
*/
function checkGameEnd() {
	let allFieldsFilled = true;

	document.querySelectorAll('td').forEach(td => {
		if (!td.textContent.trim()) {
			allFieldsFilled = false;
		}
	});

	return (allFieldsFilled);
}

function resetRound() {
	let dices = document.getElementsByClassName('dice');

	for (let i = 0; i < dices.length; i++) {
		dices[i].removeAttribute('data-hold');

		dices[i].value = 0;
	}

	values = [];

	rolled = 0;
	/*
	8. Setzen Sie die Anzahl der getätigten Würfe zurück,
	wenn eine Runde beendet wurde.
	*/
}

function toggleDice(dice) {
	/*
		7. Verhindern Sie, dass die Würfel gehalten oder
		losgelassen werden können, bevor mindestens einmal
		gewürfelt wurde.
	*/
	if (rolled > 0)
	{
		if (dice.getAttribute('data-hold')) {
			dice.removeAttribute('data-hold');
		} else {
			dice.setAttribute('data-hold', 1);
		}
	}
	dice.blur();
}
