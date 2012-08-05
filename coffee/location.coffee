engine = 'gps'document.getElementById("footerinfo").innerHTML = "Got the initial Position"
peak = 
	x: 0
	y: 0
	z: 0
lastPos = null
watch = null
class LocationController
	@getLocation: (args) ->
		document.getElementsByTagName("footer")[0]?.innerHTML = "Connecting to get location."
		if engine is "gps" 
			document.removeEventListener "devicemotion", @deviceMotion
			watch
			watch = navigator.geolocation.getCurrentPosition @deviceLocation
		else
			document.getElementById("footerinfo")?.innerHTML = "Going with metering"
			watch = null 
			window.addEventListener "devicemotion", @deviceMotion

	@deviceLocation: () ->
		coords =
			x: arguments[0].coords.longitude / 5000
			y: arguments[0].coords.latitude / 5000
		document.getElementsByTagName("footer")[0]?.innerHTML = """
			Location Debugging --------------------------------- <br>
			Latitude : #{coords.y} <br>
			Longitude: #{coords.x} <br>
		"""
		newTick coords
		lastPos = coords
	, ->
		document.getElementsByTagName("footer")[0].innerHTML = """
			Error in getting location
		"""

	@deviceMotion: (event) ->
		if event.accelerationIncludingGravity.x > peak.x then peak.x = event.accelerationIncludingGravity.x
		if event.accelerationIncludingGravity.y > peak.y then peak.y = event.accelerationIncludingGravity.y
		if event.accelerationIncludingGravity.z > peak.z then peak.z = event.accelerationIncludingGravity.z
		document.getElementById("footerinfo").innerHTML = """
			Metric Data : --------------------------------- <br>
			X : #{event.accelerationIncludingGravity.x} <br>
			Y : #{event.accelerationIncludingGravity.y} <br>
			Z : #{event.accelerationIncludingGravity.z} <br>
			<br><br>
			X Peak : #{peak.x}
			Y Peak : #{peak.y}
			Z Peak : #{peak.z}
		"""
		lastPos = 
			x: lastPos.x + event.accelerationIncludingGravity.x / 10
			y: lastPos.y + event.accelerationIncludingGravity.y / 10
		newTick coords




actions = []
offsets =
	x: 0
	y: 0
document.onkeydown = (e) ->
	switch e.keyCode
		when 38 then offsets.y--
		when 40 then offsets.y++
		when 37 then offsets.x--
		when 39 then offsets.x++
window.newTick = (args) ->	
	console.log "Tick"
	args.x += offsets.x / 10
	args.y += offsets.y / 10
	action args for action in actions
window.addAction = (action) -> actions.push action
window.switchEngine = () -> if engine is "gps" then engine = "meter" else engine = "gps" ; document.getElementById("engine").innerHTML = engine; do LocationController.getLocation

setInterval LocationController.getLocation, 500
console.log "Loaded LocationController"
