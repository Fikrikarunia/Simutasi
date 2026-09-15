<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Rekomendasi Pindah Sekolah</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.4;
            margin: 20px 40px;
            color: #000;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h3 {
            margin: 0;
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header h2 {
            margin: 2px 0;
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 9pt;
            font-style: italic;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .meta-table td {
            vertical-align: top;
        }
        .title {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            font-size: 13pt;
            margin-bottom: 5px;
        }
        .content-table {
            width: 100%;
            margin: 15px 0 15px 30px;
        }
        .content-table td {
            padding: 3px 0;
            vertical-align: top;
        }
        .footer-table {
            width: 100%;
            margin-top: 30px;
        }
        .footer-table td {
            vertical-align: top;
        }
        .stamp-box {
            text-align: center;
            width: 250px;
        }
        .qr-box {
            text-align: center;
            border: 1px dashed #666;
            padding: 8px;
            background: #fafafa;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h3>PEMERINTAH KABUPATEN BANDUNG BARAT</h3>
        <h2>DINAS PENDIDIKAN</h2>
        <p>Kompleks Perkantoran Pemerintah Kabupaten Bandung Barat,</p>
        <p>Jalan Raya Padalarang - Cisarua Km. 2, 40552, Telepon/Faximile (022) 27010112</p>
        <p>Pos-el disdik@bandungbaratkab.go.id, Laman www.disdikkbb.org</p>
    </div>

    @if(!empty($isDraft))
    <div style="background-color: #fef3c7; border: 2px dashed #d97706; color: #92400e; padding: 6px 10px; margin-bottom: 12px; text-align: center; font-size: 10.5pt; font-weight: bold; letter-spacing: 1px;">
        *** DRAF TINJAUAN SURAT REKOMENDASI MUTASI - BELUM DITERBITKAN RESMI ***
    </div>
    @endif

    <table class="meta-table">
        <tr>
            <td width="15%">Nomor</td>
            <td width="2%">:</td>
            <td width="48%"><strong>{{ $letter->letter_number }}</strong></td>
            <td width="35%" align="right">Bandung Barat, {{ \Carbon\Carbon::parse($letter->issued_at)->isoFormat('D MMMM Y') }}</td>
        </tr>
        <tr>
            <td>Lampiran</td>
            <td>:</td>
            <td>-</td>
            <td align="right">Kepada :</td>
        </tr>
        <tr>
            <td>Perihal</td>
            <td>:</td>
            <td><strong>Rekomendasi Pindah Sekolah</strong></td>
            <td align="right">
                Yth. Kepala Dinas Pendidikan<br>
                Kab/Kota Tempat Tujuan<br>
                di Tempat
            </td>
        </tr>
    </table>

    <p style="text-align: justify; text-indent: 30px;">
        Berdasarkan Surat dari Kepala {{ $app->school_origin_name }}, tanggal {{ \Carbon\Carbon::parse($app->submitted_at)->isoFormat('D MMMM Y') }} tentang rekomendasi pindah sekolah ke luar/dalam lingkungan Kabupaten Bandung Barat, maka kami memberikan izin/rekomendasi perpindahan sekolah kepada siswa tersebut di bawah ini:
    </p>

    <table class="content-table">
        <tr>
            <td width="30%">Nama</td>
            <td width="3%">:</td>
            <td width="67%"><strong>{{ strtoupper($student->name) }}</strong></td>
        </tr>
        <tr>
            <td>Tempat / Tanggal Lahir</td>
            <td>:</td>
            <td>{{ $student->birth_place ?? 'Bandung Barat' }}, {{ $student->birth_date ? \Carbon\Carbon::parse($student->birth_date)->isoFormat('D MMMM Y') : '-' }}</td>
        </tr>
        <tr>
            <td>NIS / NISN</td>
            <td>:</td>
            <td>{{ $student->nis ?? '-' }} / <strong>{{ $student->nisn }}</strong></td>
        </tr>
        <tr>
            <td>Jenis Kelamin</td>
            <td>:</td>
            <td>{{ $student->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
        </tr>
        <tr>
            <td>Kelas</td>
            <td>:</td>
            <td>{{ $app->destination_class }}</td>
        </tr>
        <tr>
            <td>Asal Sekolah</td>
            <td>:</td>
            <td>{{ $app->school_origin_name }} {{ $app->school_origin_npsn ? '(NPSN: '.$app->school_origin_npsn.')' : '' }}</td>
        </tr>
        <tr>
            <td>Pindah Sekolah Ke</td>
            <td>:</td>
            <td><strong>{{ $app->school_destination_name }} {{ $app->school_destination_npsn ? '(NPSN: '.$app->school_destination_npsn.')' : '' }}</strong></td>
        </tr>
        <tr>
            <td>Alasan Pindah Sekolah</td>
            <td>:</td>
            <td>{{ $app->reason ?? 'Mengikuti Orang Tua' }}</td>
        </tr>
    </table>

    <p style="text-align: justify; text-indent: 30px;">
        Demikian surat rekomendasi ini dibuat untuk dipergunakan sebagaimana mestinya.
    </p>

    <table class="footer-table">
        <tr>
            <td width="55%" style="vertical-align: bottom;">
                <div class="qr-box">
                    <img src="data:image/svg+xml;base64,{{ $qrCodeSvg }}" width="90" height="90" alt="QR Code Verifikasi"><br>
                    <small style="font-size: 7.5pt; color: #444;">
                        @if(!empty($isDraft))
                            <strong style="color: #b45309;">DRAF PRATINJAU DOKUMEN</strong><br>
                            Surat ini belum disahkan / diterbitkan secara resmi.
                        @else
                            Dokumen Asli Diterbitkan secara Digital oleh PETADIK KBB.<br>
                            Pindai QR Code untuk verifikasi keabsahan surat.
                        @endif
                    </small>
                </div>
            </td>
            <td width="45%" align="center">
                <p style="margin: 0;">An. Kepala Dinas Pendidikan Kab. Bandung Barat</p>
                <p style="margin: 0; font-weight: bold;">Kepala Bidang Pembinaan SD</p>
                <p style="margin: 0; font-size: 9pt; font-style: italic;">Ub. Analis Sub Koordinator Kesiswaan SD</p>
                
                <br><br><br>

                <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $letter->signed_by_name }}</p>
                <p style="margin: 0; font-size: 10pt;">NIP. {{ $letter->signed_by_nip }}</p>
            </td>
        </tr>
    </table>
</body>
</html>
