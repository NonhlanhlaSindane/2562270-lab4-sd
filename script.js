document.getElementById('fetchButton').addEventListener('click', () => {
    const countryName = document.getElementById('countryInput').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found.');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            document.getElementById('country-info').innerHTML = `
                <h2>${country.name.common}</h2>
                <p>Capital: ${country.capital[0]}</p>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Flag:</p>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            `;

            if (country.borders) {
                Promise.all(country.borders.map(border =>
                    fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                        .then(response => response.json())
                )).then(neighbours => {
                    document.getElementById('bordering-countries').innerHTML = '<h3>Bordering Countries:</h3>' +
                        neighbours.map(neighbour => `
                            <p>${neighbour[0].name.common}</p>
                            <p>Flag:</p>
                            <img src="${neighbour[0].flags.svg}" alt="Flag of ${neighbour[0].name.common}">
                        `).join('');
                });
            } else {
                document.getElementById('bordering-countries').innerHTML = '<p>No bordering countries.</p>';
            }
        })
        .catch(error => {
            document.getElementById('country-info').innerHTML = '<p>Error: ' + error.message + '</p>';
            document.getElementById('bordering-countries').innerHTML = '';
        });
});
