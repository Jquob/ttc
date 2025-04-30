ttc = "https://cors.jacoborr.org/https://myttc.ca/"

$("form").submit(function (event) {
    event.preventDefault();
    const formData = $("#search").val()
    $.getJSON(ttc + "search/" + formData + ".json", function (data) {
        html = ""
        if (data.stops.length > 0) {
            $("#results").html("")
            html += `<h5 class="text-center text-2xl font-bold m-2 mb-0 bg-red-600 text-white grow rounded-t-md">Stops</h5>`
            html += `<div class="flex flex-wrap justify-center m-2 mt-0 bg-gray-100 rounded-b-md space-x-1" id="stops">`
            for (let stops in data.stops) {
                let stop = data.stops[stops]

                html += `<button class="m-3 bg-gray-50 border-1 border-gray-300 p-2 rounded-md hover:bg-gray-200 cursor-pointer" id="${stop.uri}" onclick="getInfo(this.id, this.parentNode.id)">${stop.name}</button>`
            }
            html += `</div>`
        }

        if (data.routes.length > 0) {
            $("#results").html("")
            html += `<h5 class="text-center text-2xl font-bold m-2 mb-0 bg-red-600 text-white grow rounded-t-md">Routes</h5>`
            html += `<div class="flex flex-wrap justify-center m-2 mt-0 bg-gray-100 rounded-b-md space-x-1" id="routes">`
            for (let routes in data.routes) {
                let route = data.routes[routes]

                html += `<button class="m-3 bg-gray-50 border-1 border-gray-300 p-2 rounded-md hover:bg-gray-200 cursor-pointer" id="${route.uri}" onclick="getInfo(this.id, this.parentNode.id)">${route.name}</button>`
            }
            html += `</div>`
        }

        if (data.stations.length > 0) {
            $("#results").html("")
            html += `<h5 class="text-center text-2xl font-bold m-2 mb-0 bg-red-600 text-white grow rounded-t-md">Stations</h5>`
            html += `<div class="flex flex-wrap justify-center m-2 mt-0 bg-gray-100 rounded-b-md space-x-1" id="stations">`
            for (let stations in data.stations) {
                let station = data.stations[stations]

                html += `<button class="m-3 bg-gray-50 border-1 border-gray-300 p-2 rounded-md hover:bg-gray-200 cursor-pointer" id="${station.uri}" onclick="getInfo(this.id, this.parentNode.id)">${station.name}</button>`
            }
            html += `</div>`
        }

        if (data.stops.length === 0 && data.routes.length === 0 && data.stations.length === 0) {
            html += `<h5 class="text-center text-xl font-normal text-gray-700">No stops found</h5>`
        }

        $("#results").html(html)
    })
})

function getInfo(uri, type) {
    $.getJSON(ttc + uri + ".json", function (data) {
        html = ""
        console.log(data)
        if (type == "stops" || type == "stations") {
            $("header").html(`<a class="text-white text-4xl font-bold" href="index.html" id="header">${data.name}</a>`)
            html += `<div class="inline-flex flex-col mt-0 bg-gray-100 rounded-b-md" id="info">`

            for (stop in data.stops) {
                if (data.stops[stop].routes.length > 0) {
                    html += `<h5 class="text-center text-2xl font-bold m-2 mb-0 bg-red-600 text-white rounded-t-md text-wrap" id="${data.stops[stop].uri}">${data.stops[stop].name}</h5>`
                    html += `<div class="flex m-2 mt-0 grow rounded-b-md">`
                    html += `<div class="flex flex-wrap text-center justify-center w-fit bg-gray-100 border-1 border-gray-300 grow rounded-b-md grow">`
                    for (route in data.stops[stop].routes) {
                        html += `<div class="flex flex-col border-gray-300 text-center rounded-md border-1 text-lg m-2 bg-gray-200 grow"><p class="m-0 border-1 border-gray-400 w-full bg-gray-300 rounded-t-md hover:text-white hover:bg-red-600 cursor-pointer" onclick="getInfo('${data.stops[stop].routes[route].uri}', 'routes')"><b>${data.stops[stop].routes[route].name}</b></p>`
                        for (time in data.stops[stop].routes[route].stop_times) {
                            if (time < 3) {
                                html += `<p class="flex-row">${data.stops[stop].routes[route].stop_times[time].departure_time}</p>`
                            }
                        }
                        html += `</div>`
                    }
                    html += `</div>`
                    html += `</div>`
                }
            }
            html += `</div>`
        } else if (type == "routes") {
            $("header").html(`<a class="text-white text-4xl font-bold" href="index.html" id="header">${data.name}</a>`)
            html += `<div class="inline-flex flex-col mt-0 bg-gray-100 rounded-b-md" id="info">`
            html += `<div class="flex flex-wrap text-center justify-center w-fit bg-gray-100 border-1 border-gray-300 grow rounded-b-md grow">`
            for (shape in data.shapes) {
                html += `<div class="flex flex-col border-gray-300 text-center rounded-md border-1 text-lg m-2 bg-gray-200 grow mb-2"><p class="m-0 border-1 border-gray-400 w-full bg-gray-300 rounded-t-md bg-red-600 text-white text-xl"><b>${data.shapes[shape].name}</b></p>`
                for (stop in data.shapes[shape].stops) {
                    html += `<p class="flex-row border-b-1 border-gray-400 cursor-pointer hover:text-white hover:bg-red-600" onclick="getInfo('${data.shapes[shape].stops[stop].uri.split("#")[0]}', 'stops')">${data.shapes[shape].stops[stop].name}</p>`
                }
                html += `</div>`
            }
            html += `</div>`
            html += `</div>`
        } else {
            console.log("error fetching data, more info above")
            $("#results").html(`<h5 class="text-center text-xl font-normal text-gray-700">error fetching data, try again later</h5>
            <p class="text-center">invalid input, most likely myttc.ca is down!</p>`)
        }
        $("#results").html(html)
    }).fail(function () {
        console.log("error fetching results, more info above")
        $("#results").html(`<h5 class="text-center text-xl font-normal text-gray-700">error fetching results, try again later</h5>
        <p class="text-center">details: CORS POLICY DENIED, either cors.jacoborr.org is down or myttc.ca is down</p>`)
    })
}