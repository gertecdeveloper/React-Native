package com.gertec_800;

import android.annotation.TargetApi;
import android.app.DialogFragment;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.FormatException;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.os.Build;
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

public class NFCWriteReadFragment extends AppCompatActivity {

    private boolean isDialogDisplayed = false;

    private EditText editProcesso;
    private ProgressBar mProgress;
    private NfcLeituraGravacao nfcLeituraGravacao;
    private NfcAdapter mNfcAdapter;
    private TextView tvStatus;
    private static final String MENSAGEM_PADRAO = "GERTEC";
    private int processo = 1000;
    private byte[] getID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_forceteste);
        editProcesso = findViewById(R.id.editProcesso);
        mProgress = findViewById(R.id.progress);
        tvStatus = (TextView) findViewById(R.id.tv_status);

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
    public void onDialogDisplayed() {
        isDialogDisplayed = true;
    }

    public void onDialogDismissed() {
        isDialogDisplayed = false;
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
                if (writeToNfc(ndef, MENSAGEM_PADRAO + String.valueOf(processo))) {
                    readFromNFC(ndef);
                }
                processo--;
            }
        }
    }

    private void readFromNFC(Ndef ndef) {

        String editTex;
        String mensagem;
        Long tempoExecucao;

        try {

            mensagem = nfcLeituraGravacao.retornaMensagemGravadaCartao(ndef);
            tempoExecucao = nfcLeituraGravacao.retornaTempoDeExeculcaoSegundos();

            if(mensagem.equals("")){
                tvStatus.setText("Nenhuma mensagem cadastrada.");
            }else{
                tvStatus.setText("Aproxime o cartão.");
                editTex = editProcesso.getText().toString();
                editProcesso.setText(editTex + "\nCódigo ID:" + nfcLeituraGravacao.idCartaoHexadecimal() +"\nLeitura código: " + mensagem +
                        "\n" + String.format("\nTempo de execução: %02d segundos", tempoExecucao) );
            }

        } catch (IOException | FormatException e) {
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();

        } catch (Exception e) {
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private boolean writeToNfc(Ndef ndef, String message) {

        boolean retorno = false;

        try {

            retorno = nfcLeituraGravacao.gravaMensagemCartao(ndef, message);

            if(retorno){
                editProcesso.setText("Código ID:" + nfcLeituraGravacao.idCartaoHexadecimal() + "\nCódigo gravado: " + message + "\n");
            }else{
                editProcesso.setText("Falha ao gravar mensagem");
            }

        } catch (FormatException e) {
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();

        } catch (IOException e) {
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();

        } catch (Exception e){
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();

        } finally {
            mProgress.setVisibility(View.GONE);
        }

        return retorno;
    }


}
