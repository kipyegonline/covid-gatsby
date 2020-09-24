import vanillaCovid from "./covidvanilla"

let ur1 = "https://api.covid19api.com/summary"
export default function covid19() {



    fetchAfrica("africa");
    fetchData(ur1)
        .then(data => getNations(data))
}
let africa = [];
let africaNations = []
const fetchData = async (url) => {
    try {

        const res = await fetch(url);

        if (res.status) {
            const data = await res.json();


            return data.Countries;
        }

    }
    catch (error) {
        console.log('fetch err', error.message)
    }


}

const fetchAfrica = async (region) => {
    try {
        let url = `https://restcountries.eu/rest/v2/region/${region}`
        const res = await fetch(url);
        const data = await res.json();

        let dataset = data.map(item => {
            return {
                name: item.name,
                flag: item.flag
            }
        })
        africa = []
        africa = dataset;

    }
    catch (error) {
        console.log('fetch err', error.message)
    }

}



function getNations(data) {
    if (data) {
        data.filter(item => {
            africa.forEach(afr => {

                if (afr["name"] === item['Country']) {
                    item.flag = afr.flag;
                    africaNations.push(item)
                }
            })
        })


        vanillaCovid(africaNations)

    }
}

async function testApi() {
    const res = await fetch('https://api.covid19api.com/live/country/spain/status/confirmed/date/2020-02-21T13:13:30Z')
    const data = await res.json();
    console.log('cou', data)
}
testApi()
