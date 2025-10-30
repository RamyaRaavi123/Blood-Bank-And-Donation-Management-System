int sensor_pin = A0;  
int output_value;         // Variable to store sensor value
int pump_pin = 4;         // Output pin for pump or LED

void setup() {
  pinMode(pump_pin, OUTPUT);         // Set pump pin as output
  Serial.begin(9600);                // Start serial communication
  Serial.println("Reading From the Sensor ...");
  delay(2000);                       // Wait for sensor to stabilize
}

void loop() {
  output_value = analogRead(sensor_pin);                      // Read sensor value
  output_value = map(output_value, 550, 10, 0, 100);          // Map to percentage

  // Clamp value between 0 and 100 (optional but safe)
  output_value = constrain(output_value, 0, 100);

  Serial.print("Moisture : ");
  Serial.print(output_value);
  Serial.println("%");

  // Control the pump/LED based on soil dryness
  if (output_value < 30) {             // You can set your threshold here
    digitalWrite(pump_pin, HIGH);      // Turn ON pump
  } else {
    digitalWrite(pump_pin, LOW);       // Turn OFF pump
  }

  delay(1000);   // Wait 1 second before next reading
}
