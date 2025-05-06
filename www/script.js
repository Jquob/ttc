const ttc = "https://cors.jacoborr.org/https://myttc.ca/"

// Back button functionality
$("#backButton").on("click", function() {
    window.history.back();
});

// Show back button when needed
function updateBackButtonVisibility() {
    if (window.history.state) {
        $("#backButton").removeClass("hidden")
            .show()
            .css({ opacity: 0, left: "-50px" })
            .animate({ opacity: 1, left: "12px" }, 300);
    } else {
        $("#backButton").animate({ opacity: 0, left: "-50px" }, 300, function() {
            $(this).hide().addClass("hidden");
        });
    }
}

$("#search").on("input", function () {
    const formData = $("#search").val()
    if (formData == "") {
        $("#results").fadeOut(300, function() {
            $(this).html("");
        });

        const currentHeaderText = $("#header").text();
        if (currentHeaderText !== "My-TTC UI") {
            $("#header").fadeOut(200, function() {
                $(this).html("My-TTC UI");
                $(this).removeClass("text-4xl truncate block").addClass("text-5xl font-bold mb-7");

                $(this).fadeIn(200, function() {
                    $(this).animate({"margin-top": "30vh"}, 300);
                });
            });
        } else {
            // Just animate position if the text is already correct
            $("#header").animate({"margin-top": "30vh"}, 300);
        }

        // Hide back button on home page
        $("#backButton").fadeOut(200);
    } else {
        $("#form").submit();
        $("#results").fadeIn(150)
    }
});

$("form").submit(function (event) {
    event.preventDefault();
    const formData = $("#search").val()
    if (formData != "") {
        $("#header").animate({"margin-top": "10px"}, 200, function () {
            // Force show heading

        });
        $("#results").html(`<h5 class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center text-gray-200 text-2xl font-bold">Loading...</h5>`)
        $.getJSON(ttc + "search/" + formData + ".json", function (data) {
            html = ""

            if (data.stations.length > 0) {
                $("#results").html("")
                html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow rounded-t-2xl">Stations</h5>`
                html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="stations">`
                for (let stations in data.stations) {
                    let station = data.stations[stations]

                    html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${station.uri}" onclick="getInfo(this.id, this.parentNode.id)">${station.name}</button>`
                }
                html += `</div>`
            }

            if (data.stops.length > 0) {
                $("#results").html("")
                html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow mt-2 rounded-t-2xl">Stops</h5>`
                html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="stops">`
                for (let stops in data.stops) {
                    let stop = data.stops[stops]

                    html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${stop.uri}" onclick="getInfo(this.id, this.parentNode.id)">${stop.name}</button>`
                }
                html += `</div>`
            }

            if (data.routes.length > 0) {
                $("#results").html("")
                html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow mt-2 rounded-t-2xl">Routes</h5>`
                html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="routes">`
                for (let routes in data.routes) {
                    let route = data.routes[routes]

                    html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${route.uri}" onclick="getInfo(this.id, this.parentNode.id)">${route.name}</button>`
                }
                html += `</div>`
            }



            if (data.stops.length === 0 && data.routes.length === 0 && data.stations.length === 0) {
                html += `<h5 class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center text-yellow-500 text-2xl font-bold">No results found!</h5>`
            }
            $("#results").html(html)
            $("#header").fadeIn(0);
        })
    }
})

function animateHeaderChange(newText) {
    $("#header").stop(true, true);
    const currentText = $("#header").text();
    if (currentText !== newText) {
        $("#header").fadeOut(200, function() {
            $(this).html(newText);
            $(this).fadeIn(200);
        });
    } else {
        // Preserve large heading classes if text is the same
        $("#header").removeClass("text-4xl truncate block").addClass("text-5xl font-bold mb-7");
    }
}

function getInfo(uri, type, skipPushState = false) {
    if (!skipPushState) {
        const title = "";
        const state = { uri, type };
        window.history.pushState(state, title, `#${type}/${uri}`);
        console.log("Pushed state:", state);
        updateBackButtonVisibility();
    }

    $.getJSON(ttc + uri + ".json", function (data) {
        html = ""
        console.log(data)
        if (type == "stops" || type == "stations") {
            animateHeaderChange(data.name);
            html += `<div class="inline-flex flex-col mt-0 rounded-md w-full" id="info">`

            for (stop in data.stops) {
                if (data.stops[stop].routes.length > 0) {
                    html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow rounded-t-2xl truncate pl-2 pr-2" id="${data.stops[stop].uri}">${data.stops[stop].name}</h5>`
                    html += `<div class="border-1 border-neutral-700 bg-neutral-800 flex gap-x-2 rounded-2xl rounded-t-none mb-2.5 w-full max-w-2xl flex-wrap justify-center p-2">`
                    for (route in data.stops[stop].routes) {
                        html += `<div class="flex flex-col text-center rounded-2xl text-lg m-2 heavybg grow bg-neutral-750 items-center justify-items-center max-w-full"><p class="justify-center flex flex-row bg-neutral-700 rounded-t-2xl hover:bg-neutral-650 cursor-pointer text-neutral-300 truncate text-lg items-center hover:text-white hover:bg-neutral-600 pl-10 pr-10 pt-1 pb-1 w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis" onclick="getInfo('${data.stops[stop].routes[route].uri}', 'routes')"><b>${data.stops[stop].routes[route].name}</b><i class="fi fi-br-angle-small-right flex items-center self-center ml-1"></i></p>`
                        for (time in data.stops[stop].routes[route].stop_times) {
                            if (time < 3) {
                                html += `<p class="flex-row text-neutral-300">${data.stops[stop].routes[route].stop_times[time].departure_time}</p>`
                            }
                        }
                        html += `</div>`
                    }
                    html += `</div>`
                }
            }
            html += `</div>`
        } else if (type == "routes") {
            animateHeaderChange(data.name);
            html += `<div class="inline-flex flex-col mt-0 rounded-md overflow-x-hidden max-w-full" id="info">`
            html += `<div class="flex flex-wrap text-center justify-center w-fit max-w-full rounded-2xl">`
            for (shape in data.shapes) {
                html += `<div class="flex flex-col text-center rounded-2xl text-lg slightbg grow mb-2 max-w-full border-1"><p class="bg-neutral-700 bg-red-500 text-white text-2xl truncate ml-0.5 mr-0.5 rounded-t-2xl"><b>${data.shapes[shape].name}</b></p>`
                html += `<div class="flex flex-col text-center justify-center max-w-full rounded-b-2xl w-full border-neutral-700 border-1 pt-2">`
                for (stop in data.shapes[shape].stops) {
                    html += `<p class="m-2 ml-auto mr-auto cursor-pointer bg-neutral-700 hover:text-white hover:bg-neutral-600 text-neutral-300 truncate w-min rounded-2xl p-2 text-center" onclick="getInfo('${data.shapes[shape].stops[stop].uri.split("#")[0]}', 'stops')">${data.shapes[shape].stops[stop].name}</p>`
                }
                html += `</div>`
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

window.addEventListener("popstate", function (event) {
    console.log("Popstate event triggered", event.state);

    $("#header").stop(true, true);
    updateBackButtonVisibility();

    if (event.state) {
        const { uri, type } = event.state;
        console.log("Navigating to:", type, uri);

        $("#results").show();
        $("#header").animate({"margin-top": "10px"}, 200);

        getInfo(uri, type, true);
    } else {
        const currentHeaderText = $("#header").text();
        if (currentHeaderText !== "My-TTC UI") {
            $("#header").fadeOut(200, function() {
                $(this).html("My-TTC UI");
                $(this).removeClass("text-4xl truncate block").addClass("text-5xl font-bold mb-7");

                $(this).fadeIn(200, function() {
                    $(this).animate({"margin-top": "15rem"}, 300);
                });
            });
        } else {
            // Just animate position if the text is already correct
            $("#header").removeClass("text-4xl truncate block").addClass("text-5xl font-bold mb-7");
            $("#header").animate({"margin-top": "15rem"}, 300);
        }

        $("#search").val("");
        $("#results").fadeOut(300, function() {
            $(this).html("");
        });
    }
});

// Run this once on page load to set initial state
$(document).ready(function() {
    updateBackButtonVisibility();
});

