import os
import time
from influxdb import InfluxDBClient

client = InfluxDBClient(host='localhost', port=8086, database='jiangs1')

# Stores 60 seconds ahead of the current time
end = time.time() + 60

num_blocks_cmd = "du -c /home/student06 | grep total | sed 's/\ttotal//g'| tr -d '\n'"
cpu_leader_cmd = "top -b -d 5 -n 1 -o %CPU | head -n 8 | sed -n '$p'"

# Loop until time runs out (1 minute)
while time.time() < end:  
  
    num_blocks_output = int(os.popen(num_blocks_cmd).read())
    cpu_leader_output = os.popen(cpu_leader_cmd).read()
    
    # Split each piece of the command output into a list
    cpu_leader_list = cpu_leader_output.split()
    array_length = len(cpu_leader_list)
    
    # Second item
    top_user = cpu_leader_list[1]

    # Last item
    top_process = cpu_leader_list[array_length - 1]
    
    print("Blocks: {0}; CPU leader: {1}-{2}".format(num_blocks_output, top_user, top_process))

    json_body1 = [
        {
            "measurement": "jiangs1_blocks_used",
            "tags": {
                "studentID": "student06"
            },
            "fields": {
                "blocks_used": num_blocks_output
            }
        }
    ]

    json_body2 = [
        {
            "measurement": "jiangs1_top_cpu",
            "tags": {
                "top_user": top_user,
                "top_process": top_process
            },
            "fields": {
                "cpu_value": 1
            }
        }
    ]

    client.write_points(json_body1)
    client.write_points(json_body2)


    # Pause execution for 2 seconds
    time.sleep(2)
