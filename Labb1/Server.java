import java.io.*;
import java.net.*;
import java.math.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;
//import javax.servlet.http.Cookie;
import java.io.File; 

public class Server {

    private final int port = 8989;

    public static void main(String[] args) {
        new Server();
    }

    public static String readFile(String filename)throws IOException{
        BufferedReader file=new BufferedReader(new FileReader(filename));
        String contents ="";
        String line = "";
        while ((line = file.readLine()) != null){
            contents += line;
        }
        return contents;
    }

    public Server() { 
        try (ServerSocket serverSocket = new ServerSocket(this.port)) {
            System.out.println("Listening on port: " + this.port);
            //Map<String, List<Integer>> h = new HashMap<String, List<Integer>>();
            //HashMap<String,ArrayList<Integer>> map = new HashMap<String,ArrayList<Integer>>();
            HashMap<String,int[]> cookie_map = new HashMap<String,int[]>();

            while (true) {
                try (Socket socket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                     BufferedWriter out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))) {

                    String line;
                    while ((line = in.readLine()) != null) { // read
                        System.out.println(" <<< " + line); // log

                        if (line.matches("GET\\s+.*")) {
                            // process the GET request
                            int random_number = (int)Math.random()*(101);
                            int counter = 0;
                            String payload=readFile("guess.html");



                            Random rand = new Random();
		                    int randNum=rand.nextInt(1000);
		                    String newCookie="personuppgifter="+randNum;
                            //ArrayList <Integer> l = new ArrayList<Integer>;
                            //l.put((Arrays.asList(counter, random_number));
                            map.put(newCookie, int[]);
                            int[] test = new int[]
                            cookie_map.put(newCookie, counter);
                            String response = "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: "+newCookie+"\nContent-Length: "+payload.length()+"\nConnection: close\nContent-Type: text/html\n\n";;
                            response+=payload;
                            out.write(response);    
		                    socket.shutdownOutput();


                        
                        } else if (line.matches("POST\\s+.*")) {
                            // process the POST request
                            //System.out.println("Got a POST-request"+headers+"<");
                        }
                    }

                    System.out.println(" >>> " + "HTTP RESPONSE"); // log
                    out.write("HTTP RESPONSE"); // write
                    out.flush(); // flush

                } catch (IOException e) {
                    System.err.println(e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
            System.err.println("Could not listen on port: " + this.port);
            System.exit(1);
        }
    }

}
