package com.gertec_800;

import android.app.DialogFragment;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.FormatException;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;


import java.io.IOException;

public class NFCWriteFragment extends AppCompatActivity {

    private boolean isDialogDisplayed = false;
    private EditText editMesagemPadrao;
    private NfcAdapter mNfcAdapter;
    private static final String MENSAGEM_PADRAO = "GERTEC";
    private int processo = 1000;
    private NfcLeituraGravacao nfcLeituraGravacao;
    private byte[] getID;
    private ProgressBar mProgress;
    private TextView mTvMessage;
    private Intent intentGet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_gravacao);
        mTvMessage = findViewById(R.id.tv_message);
        mProgress = findViewById(R.id.progress);
        intentGet = getIntent();
        System.out.println("menssagem gravada: "+intentGet.getStringExtra("mensagemGravar"));
        initNFC();
    }

    private void initNFC(){
        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);
        // nfcManager = new NfcManager(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        IntentFilter tagDetected = new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED);
        IntentFilter ndefDetected = new IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED);
        IntentFilter techDetected = new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED);
        IntentFilter idDetected = new IntentFilter((NfcAdapter.EXTRA_ID));
        IntentFilter[] nfcIntentFilter = new IntentFilter[]{techDetected,tagDetected,ndefDetected, idDetected};

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        if(mNfcAdapter!= null)
            mNfcAdapter.enableForegroundDispatch(this, pendingIntent, nfcIntentFilter, null);

    }

    @Override
    protected void onPause() {
        super.onPause();
        if(mNfcAdapter!= null)
            mNfcAdapter.disableForegroundDispatch(this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);

        Log.d("TAG", "onNewIntent: " + intent.getAction());

        if (tag != null) {

            Ndef ndef = Ndef.get(tag);

            if(ndef == null){
                Toast.makeText(getApplicationContext(), "Tipo de cartão não suportado.", Toast.LENGTH_SHORT).show();
            }else{
                nfcLeituraGravacao = new NfcLeituraGravacao(ndef.getTag());
                mProgress.setVisibility(View.VISIBLE);
                String message = intentGet.getStringExtra("mensagemGravar").toString();
                writeToNfc(ndef,message);
            }
        }
    }
    private void writeToNfc(Ndef ndef, String message){

        Long tempoExecucao;
        mTvMessage.setText(getString(R.string.message_write_progress));

        if (ndef != null) {

            try {

                nfcLeituraGravacao.gravaMensagemCartao(ndef, message);
                tempoExecucao = nfcLeituraGravacao.retornaTempoDeExeculcaoSegundos();

                mTvMessage.setText(getString(R.string.message_write_success) +
                        "\n\nTempo de execução: "+String.format("%02d segundos", tempoExecucao));

            } catch (IOException e) {
                Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG ).show();
                e.printStackTrace();

            } catch (FormatException e) {
                Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG ).show();
                e.printStackTrace();
            } finally {
                mProgress.setVisibility(View.GONE);
            }
        }else{
            Toast.makeText(this,"Não foi possível ler este cartão", Toast.LENGTH_LONG ).show();
        }
    }
}


