package com.example.frozenprince.espledserver;


import android.content.Context;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;


public final class TCPChannel extends Thread {
    private Socket socket;
    private final String ip;
    private final int port;
    private final BlockingQueue<String> outputBufferQueue;
    private PrintWriter writer;
    private BufferedReader reader;
    private final List<MessageListener> msgListeners;
    private Context mainContext;

    public TCPChannel(String ip, int port, Context mainContext) {
        this.ip = ip;
        this.port = port;
        this.mainContext = mainContext;
        this.msgListeners = new ArrayList<>();
        this.outputBufferQueue = new ArrayBlockingQueue<String>(10);
        super.start();
    }


    @Override
    public void run() {
        try {
            this.socket = new Socket(this.ip,this.port);
            Toast.makeText(this.mainContext, "Connected to Server", Toast.LENGTH_LONG).show();
            new MessageNotifierThread().start();
            this.writer = new PrintWriter(socket.getOutputStream());
            try {
                while (true) {
                    String msg = outputBufferQueue.take();
                    writer.write(msg);
                    writer.flush();
                }
            } catch (InterruptedException e) {
                Toast.makeText(this.mainContext, "Failes to write message", Toast.LENGTH_LONG).show();
                e.printStackTrace();
            } finally {
                writer.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this.mainContext, "Could not create Socket or Streams", Toast.LENGTH_LONG).show();
        } finally {
            try {
                socket.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void write(String msg) {
        System.out.println("write: " + msg);
        outputBufferQueue.add(msg);
    }

    public void addMessageListener(MessageListener listener) {
        msgListeners.add(Objects.requireNonNull(listener));
    }

    public boolean removeMessageListener(MessageListener listener) {
        return msgListeners.remove(listener);
    }

    private class MessageNotifierThread extends Thread {
        @Override
        public void run() {

            try {
                reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                while (true) {
                    String msg = reader.readLine();
                    for (MessageListener listener : msgListeners) {
                        listener.messageReceived(msg);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public boolean isConnectedToServer()
    {
        if(socket != null)
        {
            return socket.isConnected();
        }
        return false;
    }
}
