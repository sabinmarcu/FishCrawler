engine = 'gps'
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
			document.removeEventListener "devicemotion", LocationController.deviceMotion
			watch = null
			watch = navigator.geolocation.getCurrentPosition LocationController.deviceLocation
		else
			document.getElementById("footerinfo")?.innerHTML = "Going with metering"
			watch = null 
			window.addEventListener "devicemotion", LocationController.deviceMotion

	@deviceLocation: (ev) ->
		coords =
			x: ev.coords.longitude
			y: ev.coords.latitude
		document.getElementsByTagName("footer")[0]?.innerHTML = """
			Location Debugging --------------------------------- <br>
			Latitude : #{coords.y} <br>
			Longitude: #{coords.x} <br>
		"""
		newTick coords
		lastPos = coords

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
			X Peak : #{peak.x} <br>
			Y Peak : #{peak.y} <br>
			Z Peak : #{peak.z} <br>
			<br><br>
			Current X : #{lastPos.x} <br>
			Current Y : #{lastPos.y} <br>
		"""
		lastPos = 
			x: lastPos.x + event.accelerationIncludingGravity.x / 200000
			y: lastPos.y + event.accelerationIncludingGravity.y / 200000
		newTick lastPos



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
	console.log offsets
	args.x += offsets.x / 10000
	args.y += offsets.y / 10000
	action args for action in actions
window.addAction = (action) -> actions.push action
window.switchEngine = () -> if engine is "gps" then engine = "meter" else engine = "gps" ; document.getElementById("engine").innerHTML = engine; do LocationController.getLocation

setInterval LocationController.getLocation, 500
console.log "Loaded LocationController"
