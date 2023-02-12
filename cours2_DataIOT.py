print  ("bonjour monde")
import network
import urequests
import utime
import ujson

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

ssid = 'Redmi Note 9 Pro'
password = 'thisma02'
wlan.connect(ssid, password)
url= "http://date.jsontest.com/"
print(wlan.isconnected())


while(True):
    try :
        print("HELLO")
        r= urequests.get(url) 
        data = r.json()
        date = data["date"]
        time = data["time"]
        print (date)
        print (time)
        r.close()
        utime.sleep(1)
    except Exception as e:
        print(e)
        
