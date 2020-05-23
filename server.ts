//import { config } from "https://deno.land/x/dotenv/mod.ts";
//import "https://deno.land/x/dotenv/load.ts";

import "https://deno.land/x/dotenv/mod.ts";
import { listenAndServe, ServerRequest, Response } from "https://deno.land/std/http/server.ts"
//import * as bigData from './bigdata.json';
const bigData = JSON.parse(Deno.readTextFileSync('./bigdata.json'));
//import * as hh from './test.json';

var port = 3000;
try {
  port = Number(Deno.env.get("PORT"));
} catch (ex) {}
if (port == null || typeof port == "undefined" || isNaN(port)) {
  port = 3000;
}

console.log(port, typeof port);

const addr = `0.0.0.0:${port}`;

function main(): void {
  listenAndServe(
    addr,
    async (req): Promise<void> => {
      console.log(req.url);
      var header = new Headers();
      header.append('Access-Control-Request-Method','*');
      header.append('Access-Control-Allow-Headers','*');
      header.append('Access-Control-Allow-Origin','https://master.d223052u932tmn.amplifyapp.com');
      header.append('Content-Type','application/json');
      var response = {
          status : 200,
          headers : header,
          body : '{}'
      }
      if (req.url == '/companies'){
        var companyList = Object.keys(bigData['Symbol']);
        response.body = JSON.stringify({list : companyList});
      }else if(req.url.startsWith('/company')){
          var params = new Map();
          try{
              var rest = req.url.split('?')[1];
              var nums = rest.split('&');
              for(var i=0;i<nums.length;i++){
                  var tokens = nums[i].split('=');
                  if (tokens[1]){
                      params.set(tokens[0].toLowerCase(),tokens[1]);
                  }else{
                      params.set(tokens[0].toLowerCase(),"");
                  }
              }
              if(params.has("name")){
                  var name = params.get("name");
                  response.body = JSON.stringify({data : bigData['Symbol'][name]});
              }else{
                  response.body = JSON.stringify({data : 'not found'});
              }
          }catch(err){
              response.body = `{"error" : "invalid request"}`;
          }
      }
      await req.respond(response);
    },
  );
  console.log(`listening on ${addr}`);
}

main();
