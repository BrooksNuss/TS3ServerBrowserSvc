using System;
using System.IO;
using System.Threading;
using TS3Client;
using TS3Client.Full;
using TS3Client.Audio;

namespace NodeClient
{
	class NodeClient
	{
		static void Main(string[] args)
		{
			Ts3FullClient client = new Ts3FullClient(TS3Client.EventDispatchType.DoubleThread);
			VersionSign version = VersionSign.VER_WIN_3_2_3;
			IdentityData identity;
			//Thread.Sleep(20000);
			string id = args[0];
			if (!string.IsNullOrEmpty(args[2])) {
				identity = Ts3Crypt.LoadIdentityDynamic(args[2]).Value;
			} else {
				identity = Ts3Crypt.GenerateNewIdentity();
			}
			var connectionConfig = new ConnectionDataFull
			{
				Username = args[1],
				ServerPassword = args[6],
				Address = args[5],
				Identity = identity,
				VersionSign = version,
				DefaultChannel = args[3],
				DefaultChannelPassword = args[4],
			};
			client.Connect(connectionConfig);
			CommandPipe commandPipe = new CommandPipe(client, id);
			Stream stdin = Console.OpenStandardInput();
			Stream stdout = Console.OpenStandardOutput();
			int ScaleBitrate(int value) => Math.Min(Math.Max(1, value), 255) * 1000;
			CheckActivePipe activePipe = new CheckActivePipe();
			AsyncStreamAudioProducer streamInPipe = new AsyncStreamAudioProducer(stdin, activePipe);
			EncoderPipe encoderPipe = new EncoderPipe(Codec.OpusVoice) { Bitrate = ScaleBitrate(48) };
			//TargetPipe targetPipe = new TargetPipe(encoderPipe, client);
			activePipe.Chain(encoderPipe).Chain(client);
			AudioPacketReader packetReader = new AudioPacketReader();
			DecoderPipe decoderPipe = new DecoderPipe();
			StreamAudioConsumer streamOutPipe = new StreamAudioConsumer(stdout);
			client.OutStream = packetReader;
			packetReader.Chain(decoderPipe);
			decoderPipe.Chain(streamOutPipe);
			commandPipe.sendCommand(IPCMessageType.CLIENT_ID, client.ClientId);
		}
	}
}
