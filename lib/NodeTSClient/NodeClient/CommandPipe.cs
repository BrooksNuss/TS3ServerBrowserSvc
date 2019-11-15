using Newtonsoft.Json;
using System;
using System.IO.Pipes;
using System.Text;
using TS3Client.Commands;
using TS3Client.Full;

namespace NodeClient {
	internal class CommandPipe {
		public bool active = false;
		private string id;
		private Ts3FullClient client;
		NamedPipeClientStream stream;
		private byte[] buffer = new byte[256];

		public CommandPipe(Ts3FullClient client, string id) {
			this.client = client;
			this.id = id;
			stream = new NamedPipeClientStream(".", id, PipeDirection.InOut, PipeOptions.Asynchronous);
			stream.Connect();
			active = true;
			init();
		}

		private async void init() {
			while (active) {
				await stream.ReadAsync(buffer, 0, buffer.Length);
				processCommand(buffer);
			}
		}

		private void processCommand(byte[] data) {
			string jsonString = Encoding.UTF8.GetString(data);
			TSClientCommand command = JsonConvert.DeserializeObject<TSClientCommand>(jsonString);
			switch (command.Type) {
				case IPCMessageType.DISCONNECT:
					client.Disconnect(); break;
				case IPCMessageType.JOIN_CHANNEL:
					client.ClientMove(client.ClientId, Convert.ToUInt64(command.Values[0])); break;
				case IPCMessageType.TOGGLE_INPUT_MUTE:
					client.Send("clientupdate", new CommandParameter("client_input_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
				case IPCMessageType.TOGGLE_OUTPUT_MUTE:
					client.Send("clientupdate", new CommandParameter("client_output_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
					// more client instructions go here
			}
		}

		public void sendCommand(IPCMessageType type, string[] values) {
			TSClientCommand command = new TSClientCommand();
			command.Type = type;
			command.Values = values;
			// convert command to json, send on ipc pipe
		}
	}
}
