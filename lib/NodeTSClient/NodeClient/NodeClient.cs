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
			//if (args.Length > 1 && args[1] != null) {
			//	identity = Ts3Crypt.LoadIdentityDynamic(args[1]).Value;
			//} else {
				identity = Ts3Crypt.GenerateNewIdentity();
			//}
			var connectionConfig = new ConnectionDataFull
			{
				Username = "TSWebClient",
				ServerPassword = null,
				Address = "3.213.117.224",
				Identity = identity,
				VersionSign = version,
				DefaultChannel = "/26",
				DefaultChannelPassword = null,
			};
			client.Connect(connectionConfig);
			Stream stdin = Console.OpenStandardInput();
			Stream stdout = Console.OpenStandardOutput();
			int ScaleBitrate(int value) => Math.Min(Math.Max(1, value), 255) * 1000;
			StreamAudioProducer streamInPipe = new StreamAudioProducer(stdin);
			TargetPipe targetPipe = new TargetPipe(streamInPipe, client);
			CheckActivePipe activePipe = new CheckActivePipe();
			EncoderPipe encoderPipe = new EncoderPipe(Codec.OpusVoice) { Bitrate = ScaleBitrate(48) };
			targetPipe.Chain(encoderPipe).Chain(client);
			AudioPacketReader packetReader = new AudioPacketReader();
			DecoderPipe decoderPipe = new DecoderPipe();
			StreamAudioConsumer streamOutPipe = new StreamAudioConsumer(stdout);
			client.OutStream = packetReader;
			packetReader.Chain(decoderPipe);
			decoderPipe.Chain(streamOutPipe);
		}
	}
}
