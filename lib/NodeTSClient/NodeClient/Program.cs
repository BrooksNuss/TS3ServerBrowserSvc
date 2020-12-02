using NodeClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NodeTSClient {
    class Program {
        static void Main(string[] args) {
			ClientConnectionManager manager = new ClientConnectionManager("tmp-NodeTS-NodeTsStream");
			Console.ReadLine();
        }
    }
}
