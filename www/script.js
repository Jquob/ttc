const ttc = "http://localhost:8080/http://myttc.ca/";

// Initialize the application based on URL parameters when page loads
$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const uri = urlParams.get('uri');
    const type = urlParams.get('type');

    if (query) {
        $("#search").val(query);
        performSearch(query);
        $("#header").animate({marginTop: '5vh'}, 150);
    } else if (uri && type) {
        $("#header").animate({marginTop: '5vh'}, 150);
        getInfo(uri, type, false);
    }

    $("#results").fadeOut(0);
});

// Listen for popstate events (back/forward button clicks)
window.addEventListener('popstate', function (event) {
    if (event.state) {
        if (event.state.query) {
            $("#search").val(event.state.query);
            performSearch(event.state.query, false);
            $("#header").animate({marginTop: '5vh'}, 150);
        } else if (event.state.uri && event.state.type) {
            $("#header").animate({marginTop: '5vh'}, 150);
            getInfo(event.state.uri, event.state.type, false);
        } else {
            // Reset to initial state
            $("#search").val("");
            $("#header").animate({marginTop: '30vh'}, 150);
            if ($("#header").text() != "My-TTC UI") {
                $("#header").fadeOut(150, function () {
                    $(this).text("My-TTC UI");
                    $(this).fadeIn(150);
                });
            }
            $("#results").fadeOut(150);
        }
    } else {
        // Handle initial state
        $("#search").val("");
        $("#header").animate({marginTop: '30vh'}, 150);
        if ($("#header").text() != "My-TTC UI") {
            $("#header").fadeOut(150, function () {
                $(this).text("My-TTC UI");
                $(this).fadeIn(150);
            });
        }
        $("#results").fadeOut(150);
    }
});

$("#search").on("input", function () {
    const formData = $("#search").val();
    if (formData !== "") {
        $("#form").submit();
        $("#header").animate({marginTop: '5vh'}, 150);
    } else if (formData === "") {
        $("#header").animate({marginTop: '30vh'}, 150);
        if ($("#header").text() != "My-TTC UI") {
            $("#header").fadeOut(150, function () {
                $(this).text("My-TTC UI");
                $(this).fadeIn(150);
            });
        }
        $("#results").fadeOut(150);
        // Update URL to base state without reloading the page
        history.pushState({}, "My-TTC UI", window.location.pathname);
    }
});

$("form").submit(function (event) {
    event.preventDefault();
    const formData = $("#search").val();
    if (formData !== "") {
        performSearch(formData, true);
    }
});

function performSearch(formData, updateHistory = true) {
    $("#results").fadeIn(150);
    $("#results").html(`<h5 class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center text-gray-200 text-2xl font-bold">Loading...</h5>`);

    $.getJSON(ttc + "search/" + formData + ".json", function (data) {
        let html = "";
        if (data.stations.length > 0) {
            html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow rounded-t-2xl">Stations</h5>`;
            html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="stations">`;
            for (let stations in data.stations) {
                let station = data.stations[stations];
                html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer min-w-0 text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${station.uri}" onclick="getInfo(this.id, this.parentNode.id, true)">${station.name}</button>`;
            }
            html += `</div>`;
        }
        if (data.stops.length > 0) {
            html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow mt-2 rounded-t-2xl">Stops</h5>`;
            html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="stops">`;
            for (let stops in data.stops) {
                let stop = data.stops[stops];
                html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer min-w-0 text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${stop.uri}" onclick="getInfo(this.id, this.parentNode.id, true)">${stop.name}</button>`;
            }
            html += `</div>`;
        }
        if (data.routes.length > 0) {
            html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow mt-2 rounded-t-2xl">Routes</h5>`;
            html += `<div class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center" id="routes">`;
            for (let routes in data.routes) {
                let route = data.routes[routes];
                html += `<button class="m-3 bg-neutral-700 p-2 rounded-xl hover:bg-neutral-600 cursor-pointer min-w-0 text-neutral-300 truncate overflow-hidden whitespace-nowrap text-ellipsis" id="${route.uri}" onclick="getInfo(this.id, this.parentNode.id, true)">${route.name}</button>`;
            }
            html += `</div>`;
        }
        if (data.stops.length === 0 && data.routes.length === 0 && data.stations.length === 0) {
            html += `<h5 class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center text-yellow-500 text-2xl font-bold">No results found!</h5>`;
        }
        $("#results").html(html);
        $("#results").fadeIn(150);
    });
}

function getInfo(uri, type, updateHistory = true) {
    if (updateHistory) {
        history.pushState({
            uri: uri,
            type: type
        }, type + ": " + uri, "?uri=" + encodeURIComponent(uri) + "&type=" + encodeURIComponent(type));
    }
    $("#results").fadeOut(150, function () {
        $("#results").html(`<h5 class="slightbg flex gap-x-2 border-1 border-neutral-700 rounded-2xl rounded-t-none mb-0.5 w-full max-w-2xl p-0.5 flex flex-wrap justify-center text-gray-200 text-2xl font-bold">Loading...</h5>`);
        $("#results").fadeIn(150);
    })
    $.getJSON(ttc + uri + ".json", function (data) {
        let html = "";
        $("#header").fadeOut(150, function () {
            $(this).html(data.name);
            $(this).fadeIn(150);
        });
        $("#results").fadeOut(150, function () {
            if (type === "stops" || type === "stations") {
                html += `<div class="inline-flex flex-col mt-0 rounded-md w-full" id="info">`;
                for (let stop in data.stops) {
                    if (data.stops[stop].routes.length > 0) {
                        html += `<h5 class="text-center text-2xl font-bold bg-red-500 text-white grow rounded-t-2xl truncate pl-2 pr-2" id="${data.stops[stop].uri}">${data.stops[stop].name}</h5>`;
                        html += `<div class="border-1 border-neutral-700 bg-neutral-800 flex gap-x-2 rounded-2xl rounded-t-none mb-2.5 w-full max-w-2xl flex-wrap justify-center p-2">`;
                        for (let route in data.stops[stop].routes) {
                            html += `<div class="flex flex-col items-center rounded-2xl text-lg m-2 heavybg grow bg-neutral-750 items-center justify-items-center max-w-full cursor-pointer" onclick="getInfo('${data.stops[stop].routes[route].uri}', 'routes', true)"><div class="flex flex-row text-center shrink-0 cursor-pointer items-center text-white bg-neutral-700 w-full max-w-full rounded-t-2xl truncate pl-2 pr-2 justify-center alig" onclick="getInfo('${data.stops[stop].routes[route].uri}', 'routes', true)"><p class="truncate shrink text-center "><b>${data.stops[stop].routes[route].name}</b></p><i class="fi fi-br-angle-small-right flex items-center self-center ml-1"></i></div>`;
                            for (let time in data.stops[stop].routes[route].stop_times) {
                                if (time < 3) {
                                    data.stops[stop].routes[route].stop_times[time].departure_time += "m"
                                    html += `<p class="flex-row text-neutral-300">${data.stops[stop].routes[route].stop_times[time].departure_time}</p>`;
                                }
                            }
                            html += `</div>`;
                        }
                        html += `</div>`;
                    }
                }
                html += `</div>`;
            } else if (type === "routes") {
                html += `<div class="inline-flex flex-col mt-0 rounded-md overflow-x-hidden max-w-full" id="info">`;
                html += `<div class="flex flex-wrap text-center justify-center w-fit max-w-full rounded-2xl">`;
                for (let shape in data.shapes) {
                    html += `<div class="flex flex-col text-center rounded-2xl text-lg slightbg grow mb-2 max-w-full border-1"><p class="bg-neutral-700 bg-red-500 text-white text-2xl truncate pl-2 pr-2 rounded-t-2xl"><b>${data.shapes[shape].name}</b></p>`;
                    html += `<div class="flex flex-col text-center justify-center max-w-full rounded-b-2xl w-full border-neutral-700 border-1 pt-2 pb-2">`;
                    for (let stop in data.shapes[shape].stops) {
                        html += `<p class="m-1 ml-auto mr-auto cursor-pointer bg-neutral-700 hover:text-white hover:bg-neutral-600 text-neutral-300 truncate w-[96%] pl-2 pr-2 rounded-xl text-center" onclick="getInfo('${data.shapes[shape].stops[stop].uri.split("#")[0]}', 'stops', true)">${data.shapes[shape].stops[stop].name}</p>`;
                    }
                    html += `</div></div>`;
                }
                html += `</div></div>`;
            }
            $("#results").html(html);
            $("#results").fadeIn(150);
        })
    });
}
