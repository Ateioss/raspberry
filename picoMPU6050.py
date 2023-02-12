from imu import MPU6050
import time
from machine import Pin, I2C, Timer
import socketio
import time
import random 
import network
import urequests
import utime
import ujson

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

ssid = 'mettre le ssid voulu'
password = 'mettre le mdp voulu'
wlan.connect(ssid, password)
url= ""

if(wlan.isconnected()):
    starttime = time.time()

    sio = socketio.Client()
    sio.connect('mettre l adresse locale ipV4 de l ordi utilisé')

    i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
    imu = MPU6050(i2c)
    led = Pin(14, Pin.OUT)
    timer = Timer()


    #timer.init(freq=2, mode=Timer.PERIODIC, callback=blink)
    while True:
    # Following print shows original data get from libary. You can uncomment to see raw data
    #print(imu.accel.xyz,imu.gyro.xyz,imu.temperature,end='\r')

    # Following rows round values get for a more pretty print:
        ax=round(imu.accel.x,2)
        ay=round(imu.accel.y,2)
        az=round(imu.accel.z,2)

        tem=round(imu.temperature,2)
        print(ax,"\t",ay,"\t",az,"\t",tem,"        ",end="\r")

    # Following sleep statement makes values enought stable to be seen and
    # read by a human from shell
        if (ax > 0.5 or ay > 0.2 or az > 0.2):
         led.toggle()
         time.sleep(1)

        @sio.on('captation')
        def on_message(data):
            print(data)

        while True:
            sio.emit('mesures', {'ax': ax, 
            'ay': ay, 'az': az, 'temp': tem + '°c'})
        #time.sleep(3.0 - ((time.time() - starttime) % 3.0))

else:
    print("error non conneected")