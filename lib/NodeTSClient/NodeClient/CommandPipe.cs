using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Runtime.InteropServices;
using System.Text;
using TS3Client.Commands;
using TS3Client.Full;

namespace NodeClient {
	internal class CommandPipe {
		public bool Active { get { return true; } }
		private string id;
		private Ts3FullClient client;
		NamedPipeClientStream stream;
		private byte[] buffer = new byte[9];

		public CommandPipe(Ts3FullClient client, string id) {
			this.client = client;
			this.id = id;
			stream = new NamedPipeClientStream(this.id);
			init();
		}

		private async void init() {
			while (Active) {
				await stream.ReadAsync(buffer, 0, buffer.Length);
				processCommand(buffer);
			}
		}

		private void processCommand(byte[] data) {
			string jsonString = Encoding.UTF8.GetString(data);
			IPCMessage command = JsonConvert.DeserializeObject<IPCMessage>(jsonString);
			switch (command.Type) {
				case IPCMessageType.DISCONNECT:
					client.Disconnect(); break;
				case IPCMessageType.CLIENT_MOVE:
					client.ClientMove(client.ClientId, Convert.ToUInt64(command.Values[0])); break;
				case IPCMessageType.TOGGLE_INPUT_MUTE:
					client.Send("clientupdate", new CommandParameter("client_input_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
				case IPCMessageType.TOGGLE_OUTPUT_MUTE:
					client.Send("clientupdate", new CommandParameter("client_output_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
					// more client instructions go here
			}
		}
	}
}
