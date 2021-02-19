package redis;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ConnectException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Scanner;

public class RedisSocket {

    public static void main(String[] args) {
        introMessages();

        // RESP messages
        
        String pingMessage = "*1\r\n$4\r\nPING\r\n";
        String getMessage1 = "*2\r\n$3\r\nGET\r\n$4\r\ntest\r\n";
        String getMessage2 = "*2\r\n$3\r\nGET\r\n$4\r\nuser\r\n";
        String yourSET     = "*3\r\n$3\r\nSET\r\n$18\r\njiangs1:faveanimal\r\n$6\r\nturtle\r\n";
        String yourGET     = "*2\r\n$3\r\nGET\r\n$18\r\njiangs1:faveanimal\r\n";

        String[] messages = new String[] 
              { pingMessage, getMessage1, getMessage2, yourSET, yourGET };
        
        
        try {
            displayRedisResponse(messages[getOption() - 1]);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private static void introMessages() {
        dashedLine();
        System.out.println("Connection timed out might mean port is not open.");
        System.out.println("Connection refused might mean redis configuration denies.");
    }

    private static void displayRedisResponse(String message)
            throws IOException {
        try (Socket echoSocket = new Socket("127.0.0.1", 6379);
                PrintWriter out =
                        new PrintWriter(echoSocket.getOutputStream(), true);
                BufferedReader in =
                        new BufferedReader(
                                new InputStreamReader(echoSocket.getInputStream()));
                )
        {
            // Get information from socket
            System.out.println("Socket address: " + echoSocket.getInetAddress());
            System.out.println("Socket port: " + echoSocket.getPort());

            // Test
            out.println(message);   // Send PING to Redis

            // You cannot use println here because it will stop with /r/n
            //   System.out.println("echo: " + in.readLine());
            int readByte = 0;

            // Set up reading loop to last for 10 milliseconds, then stop
            long t= System.currentTimeMillis();
            long end = t+10;
            while (t < end) {
                readByte = in.read();
                if (readByte == 10) System.out.print("\\n");
                else if (readByte == 13) System.out.print("\\r");
                else System.out.print((char) readByte);
                t = System.currentTimeMillis();
            }
        }
        catch (ConnectException e) {
            e.printStackTrace();
        }
        catch (UnknownHostException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void dashedLine() {
        for (int i = 0; i < 80; i++) System.out.print('-');
        System.out.println();
    }
    
    private static int getOption() {
        Scanner sc = new Scanner(System.in);
        dashedLine();
        System.out.println("Which message would you like to receive?");
        System.out.println("\t1. PING");
        System.out.println("\t2. GET test");
        System.out.println("\t3. GET user");
        System.out.println("\t4. Your SET command");
        System.out.println("\t5. Your GET command");
        System.out.println("*** Press Ctrl-C to exit.");
        dashedLine();
        return sc.nextInt();        
    }
}

