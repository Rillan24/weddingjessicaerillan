import { pixDetails } from "@/lib/wedding-data";

type PixQrProps = {
  amount: number;
};

const VERSION = 7;
const SIZE = 17 + VERSION * 4;
const DATA_CODEWORDS = 156;
const DATA_PER_BLOCK = 78;
const EC_PER_BLOCK = 20;
const GF_EXP: number[] = Array(512).fill(0);
const GF_LOG: number[] = Array(256).fill(0);

for (let value = 1, index = 0; index < 255; index += 1) {
  GF_EXP[index] = value;
  GF_LOG[value] = index;
  value <<= 1;
  if (value & 0x100) value ^= 0x11d;
}

for (let index = 255; index < GF_EXP.length; index += 1) {
  GF_EXP[index] = GF_EXP[index - 255]!;
}

const multiplyGalois = (left: number, right: number) => {
  if (left === 0 || right === 0) return 0;
  return GF_EXP[GF_LOG[left]! + GF_LOG[right]!]!;
};

const bchDigit = (value: number) => {
  let digits = 0;
  while (value !== 0) {
    digits += 1;
    value >>>= 1;
  }
  return digits;
};

const bchTypeInfo = (value: number) => {
  let remainder = value << 10;
  const generator = 0x537;

  while (bchDigit(remainder) - bchDigit(generator) >= 0) {
    remainder ^= generator << (bchDigit(remainder) - bchDigit(generator));
  }

  return ((value << 10) | remainder) ^ 0x5412;
};

const bchTypeNumber = (value: number) => {
  let remainder = value << 12;
  const generator = 0x1f25;

  while (bchDigit(remainder) - bchDigit(generator) >= 0) {
    remainder ^= generator << (bchDigit(remainder) - bchDigit(generator));
  }

  return (value << 12) | remainder;
};

const reedSolomonGenerator = (degree: number) => {
  let polynomial = [1];

  for (let index = 0; index < degree; index += 1) {
    const next = Array(polynomial.length + 1).fill(0) as number[];

    polynomial.forEach((coefficient, coefficientIndex) => {
      next[coefficientIndex]! ^= coefficient;
      next[coefficientIndex + 1]! ^= multiplyGalois(coefficient, GF_EXP[index]!);
    });

    polynomial = next;
  }

  return polynomial;
};

const reedSolomonRemainder = (data: number[], degree: number) => {
  const generator = reedSolomonGenerator(degree);
  const remainder = Array(degree).fill(0) as number[];

  data.forEach((value) => {
    const factor = value ^ remainder[0]!;
    remainder.shift();
    remainder.push(0);

    for (let index = 0; index < degree; index += 1) {
      remainder[index]! ^= multiplyGalois(generator[index + 1]!, factor);
    }
  });

  return remainder;
};

const encodeCodewords = (payload: string) => {
  const bytes = Array.from(new TextEncoder().encode(payload));
  const bits: number[] = [0, 1, 0, 0];

  for (let bit = 7; bit >= 0; bit -= 1) bits.push((bytes.length >>> bit) & 1);
  bytes.forEach((byte) => {
    for (let bit = 7; bit >= 0; bit -= 1) bits.push((byte >>> bit) & 1);
  });

  while (bits.length < DATA_CODEWORDS * 8 && bits.length % 8 !== 0) bits.push(0);

  const codewords: number[] = [];
  for (let index = 0; index < bits.length; index += 8) {
    codewords.push(bits.slice(index, index + 8).reduce((value, bit) => (value << 1) | bit, 0));
  }

  let pad = 0;
  while (codewords.length < DATA_CODEWORDS) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11);
    pad += 1;
  }

  const blocks: number[][] = [];
  for (let block = 0; block < 2; block += 1) {
    const data = codewords.slice(block * DATA_PER_BLOCK, (block + 1) * DATA_PER_BLOCK);
    blocks.push([...data, ...reedSolomonRemainder(data, EC_PER_BLOCK)]);
  }

  const interleaved: number[] = [];
  for (let index = 0; index < DATA_PER_BLOCK; index += 1) {
    blocks.forEach((block) => interleaved.push(block[index]!));
  }
  for (let index = DATA_PER_BLOCK; index < DATA_PER_BLOCK + EC_PER_BLOCK; index += 1) {
    blocks.forEach((block) => interleaved.push(block[index]!));
  }

  return interleaved;
};

const finderPattern = (modules: (boolean | null)[][], row: number, column: number) => {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      if (row + r < 0 || row + r >= SIZE || column + c < 0 || column + c >= SIZE) continue;
      modules[row + r]![column + c] =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
  }
};

const alignmentPattern = (modules: (boolean | null)[][], row: number, column: number) => {
  for (let r = -2; r <= 2; r += 1) {
    for (let c = -2; c <= 2; c += 1) {
      modules[row + r]![column + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
    }
  }
};

const pixField = (id: string, value: string) =>
  id + value.length.toString().padStart(2, "0") + value;

const crc16 = (value: string) => {
  let crc = 0xffff;

  for (let index = 0; index < value.length; index += 1) {
    crc ^= value.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
};

const makeQrMatrix = (payload: string) => {
  const modules: (boolean | null)[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(null),
  );

  finderPattern(modules, 0, 0);
  finderPattern(modules, SIZE - 7, 0);
  finderPattern(modules, 0, SIZE - 7);

  for (let index = 8; index < SIZE - 8; index += 1) {
    if (modules[index]![6] === null) modules[index]![6] = index % 2 === 0;
    if (modules[6]![index] === null) modules[6]![index] = index % 2 === 0;
  }

  [6, 22, 38].forEach((row) => {
    [6, 22, 38].forEach((column) => {
      if (modules[row]![column] === null) alignmentPattern(modules, row, column);
    });
  });

  const versionBits = bchTypeNumber(VERSION);
  for (let index = 0; index < 18; index += 1) {
    const dark = ((versionBits >>> index) & 1) === 1;
    modules[Math.floor(index / 3)]![(index % 3) + SIZE - 8 - 3] = dark;
    modules[(index % 3) + SIZE - 8 - 3]![Math.floor(index / 3)] = dark;
  }

  const formatBits = bchTypeInfo(1 << 3);
  for (let index = 0; index < 15; index += 1) {
    const dark = ((formatBits >>> index) & 1) === 1;

    if (index < 6) modules[index]![8] = dark;
    else if (index < 8) modules[index + 1]![8] = dark;
    else modules[SIZE - 15 + index]![8] = dark;

    if (index < 8) modules[8]![SIZE - index - 1] = dark;
    else if (index < 9) modules[8]![15 - index - 1 + 1] = dark;
    else modules[8]![15 - index - 1] = dark;
  }
  modules[SIZE - 8]![8] = true;

  const data = encodeCodewords(payload);
  let row = SIZE - 1;
  let direction = -1;
  let byteIndex = 0;
  let bitIndex = 7;

  for (let column = SIZE - 1; column > 0; column -= 2) {
    if (column === 6) column -= 1;

    while (true) {
      for (let offset = 0; offset < 2; offset += 1) {
        const currentColumn = column - offset;
        if (modules[row]![currentColumn] !== null) continue;

        const dark =
          byteIndex < data.length && ((data[byteIndex]! >>> bitIndex) & 1) === 1;
        modules[row]![currentColumn] = (row + currentColumn) % 2 === 0 ? !dark : dark;

        bitIndex -= 1;
        if (bitIndex < 0) {
          byteIndex += 1;
          bitIndex = 7;
        }
      }

      row += direction;
      if (row < 0 || row >= SIZE) {
        row -= direction;
        direction = -direction;
        break;
      }
    }
  }

  return modules.map((rowModules) => rowModules.map((module) => module === true));
};

export function PixQr({ amount }: PixQrProps) {
  const merchantAccount =
    pixField("00", "BR.GOV.BCB.PIX") + pixField("01", pixDetails.qrKey);
  const payload =
    pixField("00", "01") +
    pixField("26", merchantAccount) +
    pixField("52", "0000") +
    pixField("53", "986") +
    pixField("54", amount.toFixed(2)) +
    pixField("58", "BR") +
    pixField("59", pixDetails.recipient.toUpperCase()) +
    pixField("60", "SAO PAULO") +
    pixField("62", pixField("05", "***")) +
    "6304";
  const qr = makeQrMatrix(payload + crc16(payload));

  return (
    <svg
      viewBox={"0 0 " + SIZE + " " + SIZE}
      role="img"
      aria-label="QR Code PIX com o valor desta cota"
      className="size-44 rounded-xl bg-white p-2"
    >
      <rect width={SIZE} height={SIZE} fill="white" />
      {qr.flatMap((row, rowIndex) =>
        row.map((dark, columnIndex) =>
          dark ? (
            <rect
              key={rowIndex + "-" + columnIndex}
              x={columnIndex}
              y={rowIndex}
              width="1"
              height="1"
              fill="#111111"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
