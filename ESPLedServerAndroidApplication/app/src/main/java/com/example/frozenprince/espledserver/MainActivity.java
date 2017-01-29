package com.example.frozenprince.espledserver;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.speech.RecognizerIntent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private Spinner espSpinner;
    private Spinner modeSpinner;
    private SeekBar redSeekBar;
    private SeekBar greenSeekBar;
    private SeekBar blueSeekBar;
    private TextView redEditText;
    private TextView greenEditText;
    private TextView blueEditText;
    private TextView resultColorEditText;
    private Button submitButton;

    private int redColor = 0;
    private int greenColor = 0;
    private int blueColor = 0;
    private Context that;

    private TCPChannel tcpChannel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        startConnectionWithServer();
        that = this;

        espSpinner = (Spinner)findViewById(R.id.spinnerESP);
        modeSpinner = (Spinner)findViewById(R.id.spinnerMode);
        redSeekBar = (SeekBar)findViewById(R.id.seekBarRed);
        greenSeekBar = (SeekBar)findViewById(R.id.seekBarGreen);
        blueSeekBar = (SeekBar)findViewById(R.id.seekBarBlue);
        redEditText = (TextView)findViewById(R.id.editTextRed);
        greenEditText = (TextView)findViewById(R.id.editTextGreen);
        blueEditText = (TextView)findViewById(R.id.editTextBlue);
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

                String hexaDecimalColor = RGBToHexaDecimal(redColor, greenColor, blueColor);
                resultColorEditText.setText(hexaDecimalColor);
                resultColorEditText.setBackgroundColor(Color.parseColor(hexaDecimalColor));
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
                String hexaDecimalColor = RGBToHexaDecimal(redColor, greenColor, blueColor);
                resultColorEditText.setText(hexaDecimalColor);
                resultColorEditText.setBackgroundColor(Color.parseColor(hexaDecimalColor));
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
                String hexaDecimalColor = RGBToHexaDecimal(redColor, greenColor, blueColor);
                resultColorEditText.setText(hexaDecimalColor);
                resultColorEditText.setBackgroundColor(Color.parseColor(hexaDecimalColor));
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
                if(tcpChannel!= null)
                    tcpChannel.write(espData.toString());
                else
                    Toast.makeText(that, "Client Not Connected", Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return(super.onCreateOptionsMenu(menu));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId())
        {
            case R.id.action_tcp_reconnect:
                Toast.makeText(this, "Reconnect started", Toast.LENGTH_LONG).show();
                startConnectionWithServer();
                break;
            case R.id.action_tcp_status:
                if(tcpChannel == null)
                {
                    Toast.makeText(this, "Not Connected", Toast.LENGTH_LONG).show();
                }
                else if(tcpChannel.isConnectedToServer())
                {
                    Toast.makeText(this, "Connected", Toast.LENGTH_LONG).show();
                }
                break;
            case R.id.action_speech:
                promptSpeechInput();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void startConnectionWithServer()
    {
        if(tcpChannel == null)
        {
            tcpChannel = new TCPChannel("192.168.0.220", 8124);
        }
        else
        {
            Toast.makeText(this, "Already connected to server", Toast.LENGTH_LONG).show();
        }

        if(!tcpChannel.isConnectedToServer())
        {
            Toast.makeText(this, "Could not connect to server", Toast.LENGTH_LONG).show();
            tcpChannel = null;
        }
    }

    private String RGBToHexaDecimal(final int iRedValue, final int iGreenValue, final int iBlueValue)
    {
        return String.format("#%02x%02x%02x", iRedValue, iGreenValue, iBlueValue);
    }

    /**
     * Showing google speech input dialog
     * */
    private final int REQ_CODE_SPEECH_INPUT = 100;
    private void promptSpeechInput() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                getString(R.string.speech_prompt));
        try {
            startActivityForResult(intent, REQ_CODE_SPEECH_INPUT);
        } catch (ActivityNotFoundException a) {
            Toast.makeText(getApplicationContext(), getString(R.string.speech_not_supported), Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Receiving speech input
     * */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {
            case REQ_CODE_SPEECH_INPUT: {
                if (resultCode == RESULT_OK && null != data) {

                    ArrayList<String> result = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    Toast.makeText(getApplicationContext(), result.get(0), Toast.LENGTH_SHORT).show();
                }
                break;
            }

        }
    }

}

