
import { QRCodeSVG } from 'qrcode.react';
import { User, Shield, Award } from 'lucide-react';
interface IdCardProps {
  user: {
    id: string;
    name: string;
    role: string;
    photoUrl?: string;
    sport?: string;
    school?: string;
    lga?: string;
  };
}
export function IdCard({ user }: IdCardProps) {
  return (
    <div className="w-[350px] h-[550px] bg-navy relative overflow-hidden rounded-xl shadow-2xl border-4 border-gold flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      </div>

      {/* Header */}
      <div className="bg-gold p-4 text-center z-10">
        <h2 className="text-navy font-display text-2xl font-bold tracking-wider">
          ATH-PROOF
        </h2>
        <p className="text-navy-dark text-xs font-bold uppercase tracking-widest">
          Official Accreditation
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-6 z-10 text-white">
        {/* Photo Area */}
        <div className="w-40 h-40 rounded-full border-4 border-gold bg-navy-light mb-6 overflow-hidden flex items-center justify-center shadow-lg">
          {user.photoUrl ?
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-full h-full object-cover" /> :


          <User className="w-20 h-20 text-gray-400" />
          }
        </div>

        {/* Name & Role */}
        <h1 className="text-2xl font-bold text-center mb-1 font-display tracking-wide">
          {user.name}
        </h1>
        <div className="bg-gold/20 px-4 py-1 rounded-full border border-gold/50 mb-6">
          <span className="text-gold font-bold uppercase text-sm tracking-wider">
            {user.role}
          </span>
        </div>

        {/* Details Grid */}
        <div className="w-full space-y-3 mb-6">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 text-sm">ID Number</span>
            <span className="font-mono font-bold text-gold">{user.id}</span>
          </div>
          {user.sport &&
          <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Sport</span>
              <span className="font-medium">{user.sport}</span>
            </div>
          }
          {user.school &&
          <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">School</span>
              <span className="font-medium truncate max-w-[180px]">
                {user.school}
              </span>
            </div>
          }
          {user.lga &&
          <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">LGA</span>
              <span className="font-medium">{user.lga}</span>
            </div>
          }
        </div>

        {/* Footer / QR */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG
              value={`https://ath-proof.com/verify/${user.id}`}
              size={80} />

          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
            Scan to Verify
          </p>
        </div>
      </div>

      {/* Bottom Stripe */}
      <div className="h-4 bg-gold w-full mt-auto"></div>
    </div>);

}