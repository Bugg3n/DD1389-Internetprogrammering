import java.io.*;
import java.net.*;
import java.math.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;
import java.io.File; 

public class Server {

    private final int port = 8989;

    public static void main(String[] args) {
        new Server();
    }

    /*  public static String put_lastname_in_payload(String response_payload,String firstName){
        return response_payload.replace("$last_name$",firstName);
    } */

    public static String readFile(String filename)throws IOException{
        BufferedReader file=new BufferedReader(new FileReader(filename));
        String contents ="";
        String line = "";
        while ((line = file.readLine()) != null){
            contents += line;
        }
        return contents;
    }

    public static String readPayload(BufferedReader scktIn,int contentLength)throws IOException{
        char[] cbuf=new char[contentLength];
        scktIn.read(cbuf, 0, contentLength);
        return new String(cbuf);
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
                            int counter = 0;
                            String payload=readFile("guess.html");
                            Random rand = new Random();
		                    int randNum=rand.nextInt(1000);
		                    String newCookie="personuppgifter="+randNum;
                            
                            int [] list = {randNum,counter, 0, 100};
                            cookie_map.put(newCookie, list);
                            String response = "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: "+newCookie+"\nContent-Length: "+payload.length()+"\nConnection: close\nContent-Type: text/html\n\n";
                            response+=payload;
                            out.write(response);    
		                    socket.shutdownOutput();

                        
                        } else if (line.matches("POST\\s+.*")) {
                            int content_length= Integer.parseInt((((line.split("Content-Length: "))[1]).split("\n"))[0]);
	                        String payload=readPayload(in,content_length);

                            String cookie =  line.substring(line.indexOf("Cookie: ")+"Cookie: ".length());
                            cookie=cookie.substring(0,cookie.indexOf("\n"));
                            cookie=cookie.strip();
                            //cookie_map.

                            int counter = cookie_map.get(cookie)[0];
                            int randNum = cookie_map.get(cookie)[1];
                            int [] list = {randNum,counter+1, cookie_map.get(cookie)[2], cookie_map.get(cookie)[3]};
                            //cookie_map.put(cookie, cookie_map.get(cookie)[0]+1);
                            cookie_map.put(cookie, list);
                            //funkar bara om man gissar på 10-99
                            String guess = payload.substring(payload.indexOf("gissadeTalet: "), payload.length());
                            int guessInt = Integer.parseInt(guess);
                            if (guessInt == randNum){
                                //Du gissade rätt
                                cookie_map.remove(cookie);
                                payload = readFile("victory.html");
                                //skriv in 
                                out.write(payload);
                            }
                            else{
                                int lowerLimit;
                                int upperLimit;
                                int oldLowerLimit = cookie_map.get(cookie)[2];
                                int oldUpperLimit = cookie_map.get(cookie)[3];
                                if (guessInt > randNum){
                                    upperLimit = guessInt;
                                    lowerLimit = oldLowerLimit;
                                }
                                else if(guessInt < randNum){
                                    upperLimit = oldUpperLimit;
                                    lowerLimit = guessInt;
                                }
                                int [] newList = {cookie_map.get(cookie)[0], cookie_map.get(cookie)[1], lowerLimit, upperLimit};
                                cookie_map.put(cookie, newList);
                                }
                    
                            }


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
