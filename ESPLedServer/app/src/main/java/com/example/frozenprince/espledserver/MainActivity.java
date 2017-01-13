package com.example.frozenprince.espledserver;

import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private Spinner espSpinner;
    private Spinner modeSpinner;
    private SeekBar redSeekBar;
    private SeekBar greenSeekBar;
    private SeekBar blueSeekBar;
    private EditText redEditText;
    private EditText greenEditText;
    private EditText blueEditText;
    private TextView resultColorEditText;
    private Button submitButton;

    private int redColor = 0;
    private int greenColor = 0;
    private int blueColor = 0;

    private TCPChannel tcpChannel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try{
            tcpChannel = new TCPChannel("192.168.0.220", 8124);
        }catch(Exception e){
            e.printStackTrace();
        }


        espSpinner = (Spinner)findViewById(R.id.spinnerESP);
        modeSpinner = (Spinner)findViewById(R.id.spinnerMode);
        redSeekBar = (SeekBar)findViewById(R.id.seekBarRed);
        greenSeekBar = (SeekBar)findViewById(R.id.seekBarGreen);
        blueSeekBar = (SeekBar)findViewById(R.id.seekBarBlue);
        redEditText = (EditText)findViewById(R.id.editTextRed);
        greenEditText = (EditText)findViewById(R.id.editTextGreen);
        blueEditText = (EditText)findViewById(R.id.editTextBlue);
        submitButton = (Button)findViewById(R.id.button);
        resultColorEditText = (TextView)findViewById(R.id.textViewResultColor);

        List<String> espList = new ArrayList<>();
        espList.add("Testboard");
        espList.add("Schreibtisch Valentin");
        espList.add("Vitrine");

        List<String> modeList = new ArrayList<>();
        modeList.add("Color");
        modeList.add("RandomBlink");
        modeList.add("PingPongClassic");
        modeList.add("PingPongRGB");
        modeList.add("PingPongDouble");
        modeList.add("RainbowClassic");

        // Creating adapter for spinner
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, espList);
        // Drop down layout style - list view with radio button
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        // attaching data adapter to spinner
        espSpinner.setAdapter(dataAdapter);

        // Creating adapter for spinner
        ArrayAdapter<String> dataAdapter2 = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, modeList);
        // Drop down layout style - list view with radio button
        dataAdapter2.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        // attaching data adapter to spinner
        modeSpinner.setAdapter(dataAdapter2);

        redEditText.setText("0");
        greenEditText.setText("0");
        blueEditText.setText("0");

        redSeekBar.setMax(255);
        greenSeekBar.setMax(255);
        blueSeekBar.setMax(255);

        redSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                redColor = i;
                redEditText.setText("" + i);
                //String hexCol = "#" + Integer.toHexString(redColor) + "" + Integer.toHexString(greenColor) + "" + Integer.toHexString(blueColor);
                //resultColorEditText.setBackgroundColor(Color.parseColor(hexCol));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        greenSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                greenColor = i;
                greenEditText.setText("" + i);
                //String hexCol = "#" + Integer.toHexString(redColor) + "" + Integer.toHexString(greenColor) + "" + Integer.toHexString(blueColor);
                //resultColorEditText.setBackgroundColor(Color.parseColor(hexCol));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        blueSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                blueColor = i;
                blueEditText.setText("" + i);
                //String hexCol = "#" + Integer.toHexString(redColor) + "" + Integer.toHexString(greenColor) + "" + Integer.toHexString(blueColor);
                //resultColorEditText.setBackgroundColor(Color.parseColor(hexCol));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int selectedESP;
                int selectedMode;

                selectedESP = espSpinner.getSelectedItemPosition();
                selectedMode = modeSpinner.getSelectedItemPosition();

                JSONObject espData = new JSONObject();
                try {
                    espData.put("Id", selectedESP);
                    espData.put("R", redEditText.getText().toString());
                    espData.put("G", greenEditText.getText().toString());
                    espData.put("B", blueEditText.getText().toString());
                    espData.put("Mode", selectedMode);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                tcpChannel.write(espData.toString());
            }
        });

    }
}
