import java.net.*;
import java.io.*;
import java.util.*;

class Request{
    String raw;
    HashMap<String, String> headers;
    String startLine;
    String method;
    
    Request(String raw){
	this.raw=raw;
	String[] lineSplitedReq=raw.split("\n");
	startLine = lineSplitedReq[0];

    }
    public String getMethod(){
	return startLine.substring(0,startLine.indexOf(" "));
    }
    
    public static void main(String[] args){
	String s="PSOT / HTTP/1.1\nHost: 127.0.0.1:1234\nUpgrade-Insecure-Requests: 1\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\nUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15\nAccept-Language: sv-se\nAccept-Encoding: gzip, deflate\nConnection: keep-alive\n\nBODY";
	Request r=new Request(s);
    }

}

class Person{
    String forename;
    String surename;
    
}

class Form{

    
    public static String put_firstname_in_payload(String response_payload,String firstName){
	return response_payload.replace("$first_name$",firstName);
    }

        public static String put_lastname_in_payload(String response_payload,String firstName){
	return response_payload.replace("$last_name$",firstName);
	}
    
    public static String readFile(String filename)throws IOException{
	BufferedReader file=new BufferedReader(new FileReader(filename));
	String contents ="";
	String line = "";
	while ((line = file.readLine()) != null)
	    contents += line;
	return contents;
    }

    
    public static String processTheForm()throws IOException{
	BufferedReader file=new BufferedReader(new FileReader("test.html"));
	String contents ="";
	String line = "";
	while ((line = file.readLine()) != null)
	    contents += line;
	return contents;
    }
    
    public static String readPayload(BufferedReader scktIn,int contentLength)throws IOException{
	char[] cbuf=new char[contentLength];
	scktIn.read(cbuf, 0, contentLength);
	return new String(cbuf);
    }

    public static Request readRequest(BufferedReader scktIn)throws Exception{
	String startLine=scktIn.readLine();
	int bytes=0;
	String headers = "";
	String payload = "";
	//läs headern
	String line=scktIn.readLine();
	while (!line.equals("")){
	    headers += line+"\n";
	    line=scktIn.readLine();
	}	
	if ("POST".equals(startLine.substring(3))){
	    int content_length= Integer.parseInt((((headers.split("Content-Length: "))[1]).split("\n"))[0]);
	    payload=readPayload(scktIn,content_length);
	}
	Request req=new Request(startLine);//, headers, payload);
	return req;
    }
    
    public static void main(String[] args) {
	HashMap <String, Person> cookieMap=new HashMap<String, Person>();
	String firstName="";
	String lastName="";
	ServerSocket ss=null;
	while(true){
	try{
	    if(ss==null)
		ss=new ServerSocket(1234);
	    
	    Socket s=ss.accept();
	    BufferedReader scktIn=new BufferedReader (new InputStreamReader(s.getInputStream()));
	    PrintStream scktOut= new PrintStream(s.getOutputStream());
	    //??Request req=readRequest();

	    String line=scktIn.readLine();
	    int bytes=0;
	    String headers = "";
	    //läs headern
	    while (!line.equals("")){
		headers += line+"\n";
		line=scktIn.readLine();
	    }
	    //kolla om det gäller GET eller POST
	    if(headers.indexOf("GET") == 0){
		System.out.println("Got a GET-request "+headers+"<");
		int cookieIndex=headers.indexOf("Cookie: ");
		String cookie =  headers.substring(headers.indexOf("Cookie: ")+"Cookie: ".length());
		    cookie=cookie.substring(0,cookie.indexOf("\n"));
		    cookie=cookie.strip();
		
		Random rand = new Random();
		int randNum=rand.nextInt(1000);
		String newCookie="personuppgifter="+randNum;

		cookieMap.put(newCookie, new  Person());
		String payload=readFile("html_form_forename.html");
		String response= "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nSet-Cookie: "+newCookie+"\nContent-Length: "+payload.length()+"\nConnection: close\nContent-Type: text/html\n\n";
		response+=payload;
		scktOut.print(response);
		s.shutdownOutput();
	    }
	    else if(headers.indexOf("POST")==0)
		{
		    String response="";
		    System.out.println("Got a POST-request"+headers+"<");
		    String request_payload=null;
		    String response_payload=null;
		    //parse cookie
		    String cookie =  headers.substring(headers.indexOf("Cookie: ")+"Cookie: ".length());
		    cookie=cookie.substring(0,cookie.indexOf("\n"));
		    cookie=cookie.strip();
		    Person p=cookieMap.get(cookie);
		    if(headers.indexOf("/step1") == 5){
			String content_length =  headers.substring(headers.indexOf("Content-Length: ")+"Content-Length: ".length());
			content_length =  content_length.substring(0,content_length.indexOf("\n"));
			request_payload = readPayload(scktIn,Integer.parseInt(content_length));
			//parsa inmatade förnmanet från requesten och lagra den i variabeln firstName
			firstName = request_payload.substring(request_payload.indexOf("first_name=")+"first_name=".length());
			p.forename = firstName;
			response_payload=readFile("html_form_lastname.html");
			response_payload = put_firstname_in_payload(response_payload,p.forename);
			System.out.println(response_payload);
			response= "HTTP/1.1 200 OK\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nContent-Length: "+response_payload.length()+"\nConnection: close\nContent-Type: text/html\n\n";
			
		    }else
			if(headers.indexOf("/step2") == 5){
			    String content_length =  headers.substring(headers.indexOf("Content-Length: ")+"Content-Length: ".length());
			    content_length =  content_length.substring(0,content_length.indexOf("\n"));
			
			    //??request_payload = readPayload(scktIn,headers);
			    request_payload = readPayload(scktIn,Integer.parseInt(content_length));
			    //parsa inmatade efternamnet från requesten och lagra den i variabeln lastName
			    lastName = request_payload.substring(request_payload.indexOf("last_name=")+"last_name=".length());
			    p=cookieMap.get(cookie);
			    p.surename=lastName;
			    response_payload=readFile("html_form_final.html");
			    response_payload = put_lastname_in_payload(response_payload,p.surename);
			    response_payload = put_firstname_in_payload(response_payload,p.forename);
			    response= "HTTP/1.1 200 OK\nSet-cookie: "+cookie+";Max-Age=0\nDate: Mon, 15 Jan 2018 22:14:15 GMT\nContent-Length: "+response_payload.length()+"\nConnection: close\nContent-Type: text/html\n\n";

			}

		    response +=  response_payload;
		    scktOut.print(response);
		    s.shutdownOutput();

		}
	    else 
		System.out.println("UNKNOWN REQUEST!");
	    
	}catch (Exception e){
	    e.printStackTrace();
	System.out.println("fel!!!" );
	}

	}
    }
}
