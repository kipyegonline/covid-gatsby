import { C } from "./types"

export const addCovid = (payload) => ({
    type: C.ADD_COVID,
    payload
})
export const addTimeSeries = (data) => ({
    type: C.ADD_TIMESET,
    payload: transformData(data)
})


export const addCountry = (payload) => ({
    type: C.ADD_COUNTRY,
    payload
})

export const removeCountry = (payload) => ({
    type: C.REMOVE_COUNTRY,
    payload
})

export const loadingMessage = (payload) => ({
    type: C.LOADING_MESSAGE,
    payload
})
export const setMonth = (payload) => ({
    type: C.SET_MONTH,
    payload
})
export const sortCovid = (sort, cwd) => ({
    type: C.SORT_COVID, sort, sorted: cwd
})
export const sendBtn = (payload) => ({
    type: C.BTN_CLICKED,
    payload
})




const fetchData = async (url) => {
    try {

        const res = await fetch(url);

        if (res.status) {
            const data = await res.json();
            return data.Countries;
        }

    }
    catch (error) {
        console.log('fetch err data:', error.message)
    }


}

const fetchContinent = async (region) => {
    try {

        let global = "https://restcountries.eu/rest/v2/all"

        let url = region === "global" ? global : `https://restcountries.eu/rest/v2/region/${region}`

        const res = await fetch(url);
        const data = await res.json();

        let dataset = data.map(item => {
            if (item.name === "United States of America") {
                item.name = "US"
            }
            return {
                name: item.name,
                flag: item.flag
            }
        })
        return dataset;
    }
    catch (error) {
        console.log('fetch err', error.message)
    }

}



export function getNations(data, continent, countryKey, callback) {
    let dataholder = []

    if (data) {

        dataholder = data.filter(item => continent.find(afr => {

            if (item[countryKey] === "United States of America") {
                item[countryKey] = "US";
            }
            if (afr["name"] === item[countryKey]) {
                item.flag = afr.flag;
                return item
            }

        })





        )


        callback(dataholder)


    }
}

export async function covid19(callback, ur1, region, tracker) {

    try {
        tracker({ msg: "loading " + region, spin: true })

        const [covid, africa] = await Promise.all([fetchData(ur1), fetchContinent(region)])
        if (covid === undefined || africa === undefined) {
            tracker({
                msg: `Error loading ${region}..try again`, spin: true
            })
            setTimeout(() => tracker({ msg: "", spin: false }), 2000)
        } else {
            getNations(covid, africa, "Country", callback)
            tracker({ msg: "", spin: false })
        }

    }
    catch{
        console.log("promise errrr")
    }

}


///get time series of cases


const fetchEntry = ur1 => fetch(ur1).then(res => res.json()).then(data => data).catch(err => console.error(err.message));

export async function covid19Series(callback, ur1, region, tracker) {

    try {

        tracker({ msg: "loading data", spin: true });

        const [covidData, continent] = await Promise.all([fetchEntry(ur1), fetchContinent(region)])
        // console.log('seriesssss', covidData, continent)
        if (covidData === undefined || continent === undefined) {

            tracker({ msg: "Error loading..try again", spin: false })
            setTimeout(() => tracker({ msg: "", spin: false }), 2000)
        } else {
            tracker({ msg: "", spin: false })
            getNations(covidData, continent, "countryregion", callback, tracker)
        }

    }
    catch (error) {
        console.log("Line Error: ", error.message)
        tracker({ msg: error.message, spin: false })

    }


}


export const transformData = (dataset) => {
    if (dataset) {
        let counter = 0;


        return dataset.map(data => {
            let timeData = []
            const bigO = data.timeseries
            for (let ob in bigO) {

                const confirmed = bigO[ob].confirmed;
                const deaths = bigO[ob].deaths;
                const recovered = bigO[ob].recovered;
                const stats = {
                    date: ob,
                    confirmed,
                    deaths,
                    recovered
                }

                timeData = [...timeData, stats]
            }
            data.latestupdate = new Date(data.lastupdate.split("T")[0])
            let count = 0;
            data.stats = timeData.map(time => {
                return {
                    ...time,
                    date: new Date(time.date),
                    id: count++
                }


            })
            data.latest = timeData[timeData.length - 1].confirmed;
            data.deaths = timeData[timeData.length - 1].deaths;
            data.recovered = timeData[timeData.length - 1].recovered;
            data.date = timeData[timeData.length - 1].date;
            data.id = counter++;

            return data;
        })
            .sort((a, b) => b.latest - a.latest)
    }

}
let count = 0;
export const filterByMonth = (dataset, month) => {
    let holder = [];

    const res = dataset.map(d => {
        return d.filter(item => {
            if (item.date.getMonth() >= month) {

                return item
            }
        })
    })

    return res;
}

