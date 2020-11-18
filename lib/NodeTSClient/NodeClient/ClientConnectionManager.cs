using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Text;
using System.Text.Json;
using TSLib;
using TSLib.Full;

namespace NodeClient {
	class ClientConnectionManager {
		public Dictionary<string, TsClientAudioSetup> clientMap = new Dictionary<string, TsClientAudioSetup>();
		public bool active = false;
		private string id;
		NamedPipeClientStream stream;
		private byte[] buffer = new byte[256];
		private MessageReceivedHandler handlerDelegate;

		public ClientConnectionManager(string id) {
			handlerDelegate += new MessageReceivedHandler(this.EmitReceivedMessage);
			this.id = id;
			stream = new NamedPipeClientStream(".", id, PipeDirection.InOut, PipeOptions.Asynchronous);
			stream.Connect();
			active = true;
			init();
		}

		private async void init() {
			while (active) {
				await stream.ReadAsync(buffer, 0, buffer.Length);
				receiveMessage(buffer);
			}
		}

		private void receiveMessage(byte[] data) {
			string jsonString = Encoding.UTF8.GetString(data);
			var message = JsonSerializer.Deserialize<IPCMessage>(jsonString);
			TsClientAudioSetup clientSetup;
			try {
				clientSetup = clientMap[message.clid];
			} catch (ArgumentNullException e) {
				Console.WriteLine($"Invalid clid received: {message.clid}");
				return;
			}
			switch (message.type) {
				case IPCMessageType.SEND_VOICE:
					clientSetup.sendVoiceMessage((IPCMessageVoice)message.data);
					break;
				case IPCMessageType.DISCONNECT:
					clientSetup.Disconnect();
					break;
				case IPCMessageType.JOIN_CHANNEL:
					clientSetup.MoveChannel(((IPCMessageJoinChannel)message.data).cid);
					break;
				//case IPCMessageType.TOGGLE_INPUT_MUTE:
				//	client.Send("clientupdate", new CommandParameter("client_input_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
				//case IPCMessageType.TOGGLE_OUTPUT_MUTE:
				//	client.Send("clientupdate", new CommandParameter("client_output_muted", Convert.ToInt32(command.Values[0]) != 0)); break;
					// more client instructions go here
			}
		}

		public void addClient(IPCMessageConnect connectionInfo) {
			var newClient = new TsFullClient();
			VersionSign version = VersionSign.VER_WIN_3_2_3;
			IdentityData identity;
			//Thread.Sleep(20000);
			//string id = args[0];
			if (!string.IsNullOrEmpty(connectionInfo.identity)) {
				identity = TsCrypt.LoadIdentityDynamic(connectionInfo.identity).Value;
			} else {
				identity = TsCrypt.GenerateNewIdentity();
			}
			var connectionConfig = new ConnectionDataFull {
				Username = connectionInfo.clientName,
				ServerPassword = "",
				Address = "",
				Identity = identity,
				VersionSign = version,
				DefaultChannel = connectionInfo.channel,
				DefaultChannelPassword = connectionInfo.channelPassword,
			};
			newClient.Connect(connectionConfig);
			//create new setup
			var newSetup = new TsClientAudioSetup(newClient, handlerDelegate);
			this.clientMap.Add(newClient.ClientId.ToString(), newSetup);
			//create new audio setup and add it + client to the map with the new client id
			//
		}

		//Sends received and handled messages to the node server
		private void EmitReceivedMessage(IPCMessage message) {
			byte[] data = JsonSerializer.SerializeToUtf8Bytes(message);
			stream.Write(data);
		}
	}
}
