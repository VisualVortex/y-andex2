"use strict";
/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name :'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'},
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */
    /*
     * ! Для начала я бы давал переменным более понятные названия.
     *
     * */
var requests = ['/countries', '/cities', '/populations'];
var responses = {};
var rearranged_responses = {};

var get_population_by_input = function(input) {
    var res = undefined;

    if (input in rearranged_responses['populations']) res = get_city_population(input);
    else if (input in rearranged_responses['cities']) res = get_country_population(input);
    else if (input in rearranged_responses['countries']) res = get_area_population(input);
    return res
};

var get_area_population = function(area) {
    var countries = rearranged_responses['countries'][area];

    var res = undefined;
    if (countries) res = countries.reduce(function(sum, city) {
        return sum + get_country_population(city);
    }, 0);
    return res;
};

var get_country_population = function(country) {
    var cities = rearranged_responses['cities'][country];

    var res = undefined;
    if (cities) res = cities.reduce(function(sum, city) {
        return sum + get_city_population(city);
    }, 0);
    return res;
};

var get_city_population = function(city) {
    return rearranged_responses['populations'][city];
};

var rearrange_populations = function(dicts) {
    var res = {};
    dicts.forEach(function(dict) {
        res[dict['name']] = dict['count'];
    });
    return res;
};

var rearrange_cities_or_countries = function(dicts) {
    var keys = Object.keys(dicts[0]);

    var first_key = 'name';
    var second_key = keys[0] === first_key ? keys[1] : keys[0];

    var res = {};
    dicts.forEach(function(dict) {
        var first_key_val = dict[first_key];
        var second_key_val = dict[second_key];

        if (second_key_val in res) res[second_key_val].push(first_key_val);
        else res[second_key_val] = [first_key_val];
    });
    return res;
};

requests.forEach(function(request) {
    var callback = function (error, result) {

        if (error) {
            console.log(error);
        }

        responses[request] = result;

        if (Object.keys(responses).length == requests.length) {

            rearranged_responses['populations'] = rearrange_populations(responses['/populations']);
            rearranged_responses['cities'] = rearrange_cities_or_countries(responses['/cities']);
            rearranged_responses['countries'] = rearrange_cities_or_countries(responses['/countries']);

            var answer = 'Total population in African cities: ' + get_area_population('Africa');
            console.log(answer);

            var input = prompt('Specify name of city, country or area', 'Africa');
            answer = 'Total population in ' + input + ': ' + get_population_by_input(input);
            if (get_population_by_input(input) !== undefined) {
                console.log(answer);
            }
            else
                console.log("Sorry. We have no Data about this place.");
        }
    };

    getData(request, callback);

});
