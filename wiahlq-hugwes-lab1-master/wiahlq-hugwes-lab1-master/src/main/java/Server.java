import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.Random;

public class Server {

    private final int port = 8989;

    public static void main(String[] args) {
        new Server();
    }

    public static String readFile(String filename) throws IOException {
        BufferedReader file = new BufferedReader(new FileReader(filename));
        String contents = "";
        String line = "";
        while ((line = file.readLine()) != null) {
            contents += line;
        }
        return contents;
    }

    public static String readPayload(BufferedReader scktIn, int contentLength) throws IOException {
        char[] cbuf = new char[contentLength];
        scktIn.read(cbuf, 0, contentLength);
        return new String(cbuf);
    }

    public static String put_body_in_payload(String response_payload, String body) {
        return response_payload.replace("$body$", body);
    }

    public static String put_counter_in_payload(String response_payload, String counter) {
        return response_payload.replace("$counter$", counter);
    }

    public static String put_var_in_payload(String response_payload, String low_limit, String high_limit) {
        response_payload = response_payload.replace("$lowlimit$", low_limit);
        // response_payload = response_payload.replace("$counter$",counter);
        return response_payload.replace("$highlimit$", high_limit);
    }

    public Server() {
        try (ServerSocket serverSocket = new ServerSocket(this.port)) {
            System.out.println("Listening on port: " + this.port);
            HashMap<String, int[]> cookie_map = new HashMap<String, int[]>();
            HashMap<String, String> cookie_address_map = new HashMap<String, String>();

            while (true) {
                try {
                    Socket socket = serverSocket.accept();
                    BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                    PrintStream scktOut = new PrintStream(socket.getOutputStream());
                    String line = in.readLine();
                    String headers = "";

                    while (!line.equals("")) {
                        headers += line + "\n";
                        line = in.readLine();
                    }
                    // verkar kanske som man får fler get request
                    if (headers.indexOf("GET / ") == 0) {
                        // process the GET request
                        System.out.println(headers);
                        String response = "";
                        int counter = 0;
                        String payload = "";
                        String cookie = "";
                        String guesses = "guess";
                        InetSocketAddress socketAddress = (InetSocketAddress) socket.getRemoteSocketAddress();
                        String clientIpAddress = socketAddress.getAddress().getHostAddress();

                        // process cookie if there is one
                        cookie = headers.substring(headers.indexOf("Cookie: ") + "Cookie: ".length());
                        cookie = cookie.substring(0, cookie.indexOf("\n"));
                        cookie = cookie.strip();

                        // kanske leder till bugg ifall men borde ej
                        payload = readFile("guess.html");

                        // check if cookie exist alredy, otherwise create new one
                        if (cookie_map.containsKey(cookie)) {
                            if (cookie_map.get(cookie)[1] > 1) {
                                guesses = "guesses";
                            }

                            counter = cookie_map.get(cookie)[1];
                            // win condition, doubel check
                            if (cookie_map.get(cookie)[2] == cookie_map.get(cookie)[0]) {
                                cookie_map.remove(cookie);
                                cookie_address_map.remove(cookie);
                                payload = readFile("victory.html");
                                payload = put_counter_in_payload(payload, Integer.toString(counter));
                                response = "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: " + cookie
                                        + ";Max-Age=0\nContent-Length: " + payload.length()
                                        + "\nConnection: close\nContent-Type: text/html\n\n";
                                // felaktig gissning
                            } else {
                                payload = put_body_in_payload(payload,
                                        "You have made " + Integer.toString(counter) + " " + guesses);
                                payload = put_var_in_payload(payload, Integer.toString(cookie_map.get(cookie)[2]),
                                        Integer.toString(cookie_map.get(cookie)[3]));
                                response = "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: " + cookie
                                        + "\nContent-Length: " + payload.length()
                                        + "\nConnection: close\nContent-Type: text/html\n\n";
                            }
                        } else {
                            // first time
                            Random rand = new Random();
                            int randNum = rand.nextInt(100);
                            int cookieNum = rand.nextInt(1000);
                            cookie = "personuppgifter=" + cookieNum;
                            int[] list = { randNum, counter, 0, 100 };
                            cookie_map.put(cookie, list);
                            cookie_address_map.put(cookie, clientIpAddress);
                            System.out.print(clientIpAddress);
                            payload = put_body_in_payload(payload, "Welcome to the Number Guess Game.");
                            payload = put_var_in_payload(payload, Integer.toString(cookie_map.get(cookie)[2]),
                                    Integer.toString(cookie_map.get(cookie)[3]));
                            response = "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: " + cookie
                                    + "\nContent-Length: " + payload.length()
                                    + "\nConnection: close\nContent-Type: text/html\n\n";
                        }

                        response += payload;
                        scktOut.print(response);
                        scktOut.flush();

                        // Vid gissning
                    } else if (headers.indexOf("POST") == 0) {
                        // fel vi kommer in hit snabbt men sen går vi direkt till get, då krävs ingen
                        // payload

                        // läs in payloaden

                        int content_length = Integer
                                .parseInt((((headers.split("Content-Length: "))[1]).split("\n"))[0]);
                        String payload = readPayload(in, content_length);

                        // läs in coookien
                        String cookie = headers.substring(headers.indexOf("Cookie: ") + "Cookie: ".length());
                        cookie = cookie.substring(0, cookie.indexOf("\n"));
                        cookie = cookie.strip();

                        InetSocketAddress socketAddress = (InetSocketAddress) socket.getRemoteSocketAddress();
                        String clientIpAddress = socketAddress.getAddress().getHostAddress();
                        try {
                            if (!(cookie_address_map.get(cookie).equals(clientIpAddress))) {

                                System.out.println("Cookie-theft!");
                            }

                            else {
                                // initalisera variablerna
                                int randNum = cookie_map.get(cookie)[0];
                                int counter = cookie_map.get(cookie)[1] + 1;

                                // tar fram gissade talet
                                String guess = payload
                                        .substring(payload.indexOf("gissadeTalet: ") + "gissadeTalet: ".length());

                                System.out.println(guess);
                                int guessInt;
                                try {
                                    guessInt = Integer.parseInt(guess);
                                } catch (NumberFormatException e) {
                                    guessInt = 101;
                                }
                                String response = "";
                                if (guessInt > cookie_map.get(cookie)[3] || guessInt < cookie_map.get(cookie)[2]) {
                                    System.out.println("Fel intervall!");
                                    counter = counter - 1;
                                    response = "HTTP/1.1 303 See Other\nLocation: /\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nConnection: close\nContent-Type: text/html\n\n";
                                } else {
                                    int lowerLimit;
                                    int upperLimit;
                                    int oldLowerLimit = cookie_map.get(cookie)[2];
                                    int oldUpperLimit = cookie_map.get(cookie)[3];
                                    if (guessInt > randNum) {
                                        upperLimit = guessInt;
                                        lowerLimit = oldLowerLimit;
                                    } else {
                                        upperLimit = oldUpperLimit;
                                        lowerLimit = guessInt;
                                    }
                                    int[] list = { randNum, counter, cookie_map.get(cookie)[2],
                                            cookie_map.get(cookie)[3] };
                                    // uppdatera counter
                                    cookie_map.put(cookie, list);
                                    int[] newList = { cookie_map.get(cookie)[0], cookie_map.get(cookie)[1], lowerLimit,
                                            upperLimit };
                                    cookie_map.put(cookie, newList);

                                    response = "HTTP/1.1 303 See Other\nLocation: /\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nConnection: close\nContent-Type: text/html\n\n";
                                }
                                scktOut.print(response);
                                scktOut.flush();
                            }
                        } catch (NullPointerException e) {
                            System.out.println("Unfamiliar cookie");
                        }
                    }
                    socket.shutdownOutput();
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
