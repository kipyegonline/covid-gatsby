import React,{ useState, useEffect } from "react"
const Header = () => {
    let word = ["Interactive"]
    const [data, setData] = useState(word)

    let holder1 = ["Interactive", "Corona Virus"];
    let holder2 = ["Interactive", "Corona Virus", "Visualisation"];



    useEffect(() => {

        let timer;
        timer = setTimeout(() => setData(holder1), 2000)

        return () => clearTimeout(timer)
    }, [])
    useEffect(() => {
        let timer
        timer = setTimeout(() => setData(holder2), 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="p-2 header-text" style={{ backgroundColor: "#fff" }}>
            <h3 style={{ fontFamily: "roboto" }} className="text-header text-shadow text-center">
                {data.join(" ")}</h3>
        </div>
    )
}
export default Header

const grim = ["Intercative", "Covid-19", "Visualisation"]